export class CommunityPost {
    id: string;
    date: Date;
    imageUrl: string;
    title: string;
    description: string;
    audioUrl: string;
    myUp: boolean;
    myDown: boolean;

    public static Mock(title: string, imageUrl: string, audioUrl: string): CommunityPost {
        let cp: CommunityPost = new CommunityPost();
        cp.id = '123456789';
        cp.date = new Date();
        cp.imageUrl = imageUrl;
        cp.title = title;
        cp.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br><br><strong>#agos #demopodcast #audio</strong>';
        cp.audioUrl = audioUrl;
        cp.myUp = false;
        cp.myDown = false;

        return cp;
    }
}