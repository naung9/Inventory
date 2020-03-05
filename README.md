# Inventory

Hobby project that use React Native and Google Firebase for simple Inventory tracking that aims to help ISGM Employees, especially at Japan to list, display and manage their belongings for sharing.

## Technology stacks

- [React](https://reactjs.org/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/) ([Authentication](https://firebase.google.com/docs/auth), [Firestore](https://firebase.google.com/docs/firestore), [Storage](https://firebase.google.com/docs/storage))
- [Invertase](https://invertase.io/oss/react-native-firebase) (React Native Firebase library)
- [React Native Paper](https://callstack.github.io/react-native-paper/) (Material Design For React Native)
- [React Native Material textfields](https://github.com/n4kz/react-native-material-textfield) (Material design textfields)
- [React Native Image Picker](https://github.com/react-native-community/react-native-image-picker)

## Before you read the source code, you need
- Node Js, NPM/Yarn
- EMCA Script Version ^6 Knowledge. (ES6 ++)

## Features
- [x] No server side code. Firebase is awesome
- [x] Cross Platform. (IOS / Android)
- [x] Code can be easily converted to Web version later. // Power of Javascript and React
- [x] Authentication and Registration
- [x] Adding, Editing your inventory items
- [x] Search other people's belongings and request for rent if you need
- [x] Approve/Deny to people's requests for your items
- [ ] Notifications. (Not yet Implemented. See [Issue](https://github.com/naung9/Inventory/issues/1)

## Installation (Available Only For Android)
- Download and Install [InventoryManagement.apk](https://github.com/naung9/Inventory/releases/download/V-0.0.1-beta/InventoryManagement-v-0.0.1-beta.apk)

## Want to Build your own ?
1. Clone this repo
2. CD to cloned directory
3. Run ```npm install```

### Want to use your own Firebase project?
1. Add android application with android package name `com.naung9.inventory` in your Firebase project.
2. Add ios application with ios bundle name `com.naung9.inventory` in your Firebase project.
3. Download `GoogleService-Info.plist` and `google-services.json` from your firebase project
4. Skip the `Add Firebase SDK` and `Add Initialization Code` parts.
5. Replace {cloned_directory}/android/app/google-services.json file with your downloaded file.
6. Replace {cloned_directory}/ios/GoogleService-Info.plist with your downloaded file.
7. Set up "Sign In Method" with "Email/Password" type.
8. Create database in Cloud Firestore.
9. Update Cloud Firestore database rule with following
```
service cloud.firestore {
  match /databases/{database}/documents {
  	match /accesskeys/{keys} {
    	allow read: if true;
    }
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.firebase.sign_in_provider != 'anonymous';
    }
  }
}
```
10. Create a new collection in Cloud Firestore Database with ID "accesskeys" and add a new document to it with following fields.
```
Field = key
Type = string
Value = {A_KeyCode_of_your_choice_random_recommended}

Field = organization
Type = string
Value = {Organization_Name_Of_Your_Choice_E.G ISGM}
```
11. Set UP Firebase Cloud Storage with Default options or OPTIONS of your choice.

### Build Android
#### PreRequisites
- Android Studio
- Android SDK
- Read And Follow "React Native Cli Quick Start" of [React Native Getting Started](https://reactnative.dev/docs/getting-started)

#### Generate APK Step By Step
1. CD to cloned directory
2. Run 
> npx react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res/
3. CD to {cloned_directory}/android
4. Run
> ./gradlew assembleDebug
5. You will find your app-debug.apk in {cloned_directory}/android/app/build/outputs/apk/debug/

### Build IOS
#### PreRequisites
- A Mac
- XCode
- Cocoapods
> sudo gem install cocoapods

#### Install IOS Step By Step
1. CD to {cloned_directory}/ios
2. run. 
> pod install
3. CD back to {cloned_directory}
4. run
> npx react-native run-ios --configuration Release
