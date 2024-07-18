import app from "./index";

(async () => {
  try {
    await app.listen({
      port: process.env.PORT || 8000,
      host: "0.0.0.0",
    });
  } catch (error) {
    console.log(error);
  }
})();
