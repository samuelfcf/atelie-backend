import app from './app.js';

app.listen(process.env.PORT, () => {
    console.clear();
    console.log(`Env: ${process.env.NODE_ENV}`);
    console.log(`server is running on port ${process.env.PORT}`);
});
