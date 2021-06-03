# Modular Documents
### A modular document creation system

<p align="center">
  <img alt="Modular Documents Logo" src="/public/logo.png">
</p>

### To view in your browser, go to this website: [Modular Documents](https://modular-documents.netlify.app/)

## Steps to run the app locally

To run this locally, navigate to the directory you wish to download this into on your terminal, and run this:
```
git clone https://github.com/rtjoa/modular-documents.git
```

Once you've done that, run the following command:
```
cd modular-documents
```

Now run this to install all the dependencies needed:
```
npm install
```

Then run the following to open the website on localhost 3000
```
npm start
```

This should redirect you to the page in your browser.<br>
If it doesn't, go to the following website
```
localhost:3000/
```

## Tech Stack
We used a [React](https://reactjs.org/) frontend to communicate with [Firebase](https://firebase.google.com/) for backend. 
A Firestore database stores the data of the individual documents as well as other meta information about the documents such as the document owner. 
We also make use of the Firebase storage to store images that users upload, so that they are retrievable after leaving the page.

## Creators
[Nareh Agazaryan](https://github.com/nareha)<br>
[Advaith Gowrishetty](https://github.com/advaithg)<br>
[Austin Law](https://github.com/AustinLaw8)<br>
[Ryan Tjoa](https://github.com/rtjoa)<br>
[Conway Xu](https://github.com/Gishki23)
