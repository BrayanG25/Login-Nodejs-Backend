import app from './src/App/app.js';

const PORT = app.get('port');

app.listen(PORT, () => console.info(`Server on port: ${PORT}`));