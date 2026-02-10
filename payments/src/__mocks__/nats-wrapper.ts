export const natswrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        },
      ), // Mock implementation of the publish method
  },
};
