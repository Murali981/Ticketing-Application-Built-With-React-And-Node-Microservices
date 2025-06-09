import "bootstrap/dist/css/bootstrap.css";

export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

// Behind the scenes whenever we try to navigate to some distinct page with next.js. Next.js is going to import your component from one
// of these different files.In our case it can be either banana.js (or) index.js. Next.js does not take just your component and show it on
// the screen. However it wraps it up inside of it's own custom default component and that is referred to inside the next.js as the app.
// By defining _app.js as the file name is, we have defined our own custom app component. So whenever we visit "localhost:3000/banana" inside
// our google browser (or) the root route which will show our index.js component then the next.js is going to import that particular component
// and it is going to pass into the above _app.js component as a Component prop. So in the above the "Component" is either equal to the
// Banana.js component (or) index.js component. And the "pageProps" are going to be the set of components that we are intending to pass
// either to the banana.js (or) index.js component. Think the above "_app.js" is like a thin wrapper around the component that we are trying
// to show on the screen. Whenever we want to include some Global CSS into our project which Bootstrap is, We can only import Global CSS
// into this app file. As we try to visit some other components (or) other pages like let us say if we have gone to "localhost:3000/banana"
// route then the banana.js component has to load but the next.js is not going to load up (or) even parse this index.js file. So any CSS
// which we have imported will not be included inside of our final HTML file. So if we have any global CSS file that must be included on
// every single page then it has to be imported into the _app.js file. Because this _app.js is the only file that we are guaranteed to
// load up every single time a user comes to our application.
