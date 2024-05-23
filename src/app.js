require('dotenv').config();

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const MongoProductManager = require('./dao/MongoProductManager');
const ProductManager = require('./ProductManager');
const connectDB = require('./config');
const Message = require('./dao/models/Message');
const handlebars = require('handlebars');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Conectar a MongoDB
connectDB();

// Configurar Handlebars
const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(handlebars),
  defaultLayout: 'main',
  layoutsDir: 'views/layouts'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'views');

// Configurar archivos estáticos
app.use(express.static('public'));

// Crear instancia de los managers
const mongoProductManager = new MongoProductManager();
const productManager = new ProductManager('./data/productos.json');

// Ruta para la vista home
app.get('/', async (req, res) => {
  const products = await mongoProductManager.getProducts();
  res.render('home', { products });
});

// Ruta para la vista realTimeProducts
app.get('/realtimeproducts', async (req, res) => {
  const products = await mongoProductManager.getProducts();
  res.render('realTimeProducts', { products });
});

// Ruta para la vista de chat
app.get('/chat', (req, res) => {
  res.render('chat');
});

// Iniciar servidor WebSocket
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });

  // Escuchar evento para agregar un producto
  socket.on('addProduct', async (product) => {
    await mongoProductManager.addProduct(product);
    io.emit('productListUpdated', await mongoProductManager.getProducts());
  });

  // Escuchar evento para eliminar un producto
  socket.on('deleteProduct', async (id) => {
    await mongoProductManager.deleteProduct(id);
    io.emit('productListUpdated', await mongoProductManager.getProducts());
  });

  // Escuchar evento de chat
  socket.on('chatMessage', async (msg) => {
    const newMessage = new Message(msg);
    await newMessage.save();
    io.emit('message', msg);
  });
});

// Iniciar el servidor
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Servidor iniciado en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(`No se pudo iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();
