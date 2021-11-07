import app from './app.js';

app.listen(4000, () => {
    console.clear();
    console.log(`Env: ${process.env.NODE_ENV}`);
    console.log(`server is running on port ${process.env.PORT}`);
});
