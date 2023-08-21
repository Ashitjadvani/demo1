import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';

export enum CameraType {
    Front = 'Front',
    Back = 'Back'
}

export class CameraAvailable {
    name: string;
    type: CameraType;
}

@Component({
    selector: 'fco-qr-scanner',
    templateUrl: './qr-scanner.component.html',
    styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements OnInit {
    @ViewChild('scannerVideoContainer', { static: true }) scannerVideoContainer: ElementRef;
    @ViewChild('scannerVideo', { static: true }) scannerVideo: ElementRef;

    @Output() scanSuccess: EventEmitter<string> = new EventEmitter<string>();
    @Input() removeComponentAfterScan: boolean = true;
    mediaStream: MediaStream;
    currentConsole: any;
    scanComplete: boolean;
    videoWidth: number;
    videoHeight: number;
    videoRatio: number;
    cameraType: CameraType = CameraType.Back;

    constructor() { }

    @Input() set width(w: number) {
        this.videoWidth = w;
        this.applyContraints();
    }

    @Input() set height(h: number) {
        this.videoHeight = h;
        this.applyContraints();
    }

    @Input() set ratio(r: number) {
        this.videoRatio = r;
        this.applyContraints();
    }

    @Input() set camera(ct: CameraType) {
        this.cameraType = ct;
        this.closeVideoStream();
        this.openUserMedia();
    }

    ngOnInit(): void {
        console.log('QR-scanner init');
    }

    openUserMedia() {
        // prevent log flood by BrowserMultiFormatReader scan exceptions
        //
        this.currentConsole = window.console.log;
        window.console.log = function () { };

        const constraints = this.cameraType == CameraType.Back ?
            {
                audio: false,
                video: {
                    facingMode: this.cameraType == CameraType.Back ? "environment" : "user"
                },
                width: this.videoWidth,
                height: this.videoHeight
            } :
            {
                audio: false,
                video: true,
                width: this.videoWidth,
                height: this.videoHeight,
            };

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            this.mediaStream = stream;
            this.scanVideoStream();
        }).catch(reason => {
            console.error('QR-scanner error: ', reason);
        });
    }

    scanVideoStream() {
        this.currentConsole('QR-scanner tracks: ', this.mediaStream.getTracks());
        this.scanComplete = false;

        const options = {
            delayBetweenScanAttempts: 100,
            delayBetweenScanSuccess: 500,
        };
        let reader: BrowserMultiFormatReader = new BrowserMultiFormatReader(null, options);
        reader.decodeOnceFromStream(this.mediaStream, this.scannerVideo.nativeElement).then((result) => {
            if (!this.scanComplete) {
                this.scanComplete = true;

                this.currentConsole('QR-scanner scanner: ', result);
                this.mediaStream.getTracks().forEach(t => t.stop());
                this.scanSuccess.emit(result.getText());
            }
        });
    }

    closeVideoStream() {
        try {
            if (this.currentConsole)
                window.console.log = this.currentConsole;
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(t => t.stop());
            }
        } catch (ex) {
            console.error('QR-scanner closevideostream error: ', ex);
        }
    }

    applyContraints() {
        try {
            const videoTracks = (this.mediaStream && this.mediaStream.getVideoTracks()) ? this.mediaStream.getVideoTracks() : null;
            if (!videoTracks)
                return;

            const track = videoTracks[0];
            const constraints = {
                video: {
                    facingMode: this.cameraType == CameraType.Back ? "environment" : "user"
                },
                width: this.videoWidth,
                height: this.videoHeight,
                advanced: [
                    {
                        aspectRatio: this.videoRatio
                    }
                ]
            }

            console.info('QR-scanner constraints: ', constraints);

            track.applyConstraints(constraints);
        } catch (ex) {
            console.error('QR-scanner constraints error: ', ex);
        }
    }

    ngOnDestroy() {
        window.console.log = this.currentConsole;
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(t => t.stop());
        }
    }
}
