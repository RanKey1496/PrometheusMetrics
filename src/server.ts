import app from './app';

const server = app.listen(8000, () => {
    console.log('Running at localhos:8000');
});

export default server;