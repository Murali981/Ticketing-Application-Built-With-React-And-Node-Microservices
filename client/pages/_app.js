import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // console.log("App context is", appContext); // This will log the appContext object to the console
  // console.log(Object.keys(appContext)); // This will log the keys of the appContext object to the console
  // console.log(appContext.ctx.req.headers); // This will log the headers of the request to the console
  // This is the function that will be called whenever we try to navigate to some distinct page with next.js.
  // It will be called before the component is rendered.
  // console.log(appContext.ctx); // This will log the context of the app to the console
  // console.log(appContext.ctx.Cookie);
  // console.log(appContext.Component); // This will log the Component that is being rendered to the console
  const client = buildClient(appContext.ctx); // This will use the buildClient function to create an axios instance
  const { data } = await client.get("/api/users/currentuser"); // This will get the current user data from the API.
  // console.log(appContext.ctx); // This will log the context of the app to the console
  // console.log(appContext.ctx.req.headers); // This will log the headers of the request to the console
  // console.log(data); // This will log the current user data to the console
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    console.log("The pageProps are", pageProps); // This will log the pageProps to the console
  }
  // If you want to log the headers of the request, you can uncomment the line below:
  return {
    pageProps,
    currentUser: data.currentUser, // This will return the current user data as props to the AppComponent
    // If you want to return other props, you can return an object like this:
  }; // This will return the current user data as props to the AppComponent
  // If you want to return other props, you can return an object like this:
  // return { pageProps: { currentUser: data.currentUser } };
  // If you want to get the initial props of the Component, you can do it like this:
  // const { Component } = appContext;
  // This will get the Component that is being rendered
  // const appProps = await AppComponent.getInitialProps(appContext);
  // return { ...appProps };
};

export default AppComponent;
// This is the _app.js file in Next.js which is used to customize the default App component that wraps all pages.

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
