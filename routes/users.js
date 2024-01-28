const express = require('express')
const router = express.Router()
const {generateToken, verifyToken} = require("../middlewares/authMiddleware.js")
const users = require("../data/users.js")

router.get('/', (req, res) => {
    const loginForm = `
    <form action="/login" method="post">
      <label for="username">Usuario :</label>
      <input type="text" id="username" name="username" required><br>

      <label for="password">Contraseña :</label>
      <input type="password" id="password" name="password" required><br>

      <button type="submit">Iniciar sesión</button>
    </form>
    <a href="/dashboard">dashboard</a>
  `;
  const loginForm2 = `
    <p>Estas logeado</p>
  <a href="/dashboard">dashboard</a>
  <form action = "/logout" method="post">
  <button type="submit">Cerrar sesión</button>
  </form>`;

  if (!req.session.token) {
    res.send(loginForm);

}else {
    res.send(loginForm2)
}
})

router.post('/login', (req, res) => {
    const { username, password } = req.body; //destructuring de lo que pasamos del formulario del front (de la variable loginForm)
    const user = users.find(
      //lo buscamos a ver si existe haciendo dos condiciones de comparación.
      (user) => user.username === username && user.password === password
    ); // si se están cumpliendo estas dos condiciones lo guardamos en la varable user.
    if (user) {
      //si el usuario existe, genera el token() del user
      const token = generateToken(user);
      req.session.token = token; //vamos a pasarle el token al session de la línea 17 para que luego sea accesible.
      res.redirect('/dashboard'); // si ocurre lo llevará al dashboard de usuario donde validará, por el middelware que le hemos puesto, de todo lo que le pasamos
    } else {
      res.status(401).json({ mensaje: 'credenciales incorrectas' }); //si no existe el usuario
    }
  });

router.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((user) => user.id === userId);
    if (user) {
      res.send(`
      <h1>Bienvenido, ${user.name}</h1>
      <p>ID: ${user.id}</p>
      <p>UserName: ${user.username}</p>
      <a href="/">HOME</a>
      <form action = "/logout" method="post">
      <button type="submit">Cerrar sesión</button>
      </form>
      `);
    } else {
      res.status(401).json({ mensaje: 'usuario no encontrado' });
    }
  });

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = {router}









