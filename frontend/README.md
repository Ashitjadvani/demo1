# Irina development env

# Files Organization
Files are organized inside two main directory:
- **/backend**: contains all the source code for backend services
- **/frontend**: contains Angular workspace for the frontend Applications.

## Backend Services

- **/auth-providers**: contains authentication providers
- **/common**: common modules
- **/core**: the Irina core backend service
- **/plug-ins:** the Irina microservices
- **/rpc**: RPC stubs
- **/utility**: script utility

### Start backend services

install node modules:
```
cd /auth-providers/active-directory; npm install
cd /auth-providers/azure; npm install
cd /core; npm install
cd /plug-ins/approval-requests-manager; npm install
cd /plug-ins/calendar-manager; npm install
cd /plug-ins/resource-booking; npm install
cd /plug-ins/server-touchpoint; npm install
cd /plug-ins/site-manager; npm install
cd /plug-ins/user-manager; npm install
```
run backend scripts:
```
- nodejs core/server-core.js
- nodejs plug-ins/approval-requests-manager/server-approval-requests-manager.js
- nodejs plug-ins/calendar-manager/server-calendar-manager.js
- nodejs plug-ins/server-touchpoint/server-touchpoint.js
- nodejs plug-ins/site-manager/server-site-manager.js
- nodejs plug-ins/user-manager/server-user-manager.js
- nodejs plug-ins/resource-booking/server-resource-booking.js
```
initialize first tenant and its admin user:
```
	nodejs plug-ins/user-manager/server-initialize-admin.js <admin user name> <admin user password> <tenant/company name>
```
example:
```
	nodejs plug-ins/user-manager/server-initialize-admin.js admin P@ssW0rd IRINA
```

## Angular Frontend

- **/fe-app**: main Irina application
- **/fe-insights**: Irina administration console
- **/fe-touchpoint**: Irina touchpoint application
- **/fe-common**: common frontend modules.

### Start frontend applications

install node modules:
```
cd /fe-workspace; npm install
```

run Angular application
```
cd fe-workspace
ng serve fe-app 
ng serve fe-insights --port 8001
ng serve fe-touchpoint --port 7001 
```

Now pointing web-browser to http://localhost:8001 you can login using administration credentials and start configuring the tenant: user, accounts, sites, etc. etc.


