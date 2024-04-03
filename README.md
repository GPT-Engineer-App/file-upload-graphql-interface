# file-upload-graphql-interface

Interface that will enable me upload a single file of .mp4 and send it to an graphql API and return the response. 

While the job is running:
- The app is polling the same API to check on its status
- The uses should be kept up to date on the status

Once finished: 
 - It should show show success
- The user should be able to preview the file (.fbx file) 
- THe user should be able to  download the file to his device 

Please mock the API responses and other server fucntionality

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/file-upload-graphql-interface.git
cd file-upload-graphql-interface
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Tech stack

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Chakra UI](https://chakra-ui.com/)

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
