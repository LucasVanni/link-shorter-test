import { Client } from '@elastic/elasticsearch';
import { createLogger, format, transports } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'changeme',
  },
});

const esTransport = new ElasticsearchTransport({
  level: 'info',
  client: client,
  index: 'logs', // Certifique-se de que o índice está correto
});

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console(), esTransport],
});

logger.on('error', (error) => {
  console.error('Erro no logger:', error);
});

esTransport.on('error', (error) => {
  console.error('Erro no ElasticsearchTransport:', error);
});
export default logger;
