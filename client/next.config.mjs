export default {
  webpack: (config) => {
    return {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 300,
      },
    };
  },
  allowedDevOrigins: ["ticketing.dev"],
};

// The above file is automatically loaded by the next.js whenever our project starts up.
