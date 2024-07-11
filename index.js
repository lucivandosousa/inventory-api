const express = require('express')
const { PrismaClient } = require('@prisma/client')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 9999
const JWT_SECRET = 'jwt_secret_inventory'

app.use(express.json())
app.use(cors())

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: 'Email já registrado' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  } else {
    res.status(401).json({ error: 'Email ou senha incorretos' })
  }
})

app.post('/items', async (req, res) => {
  const { name, description, quantity, category, image } = req.body
  const item = await prisma.item.create({
    data: {
      name,
      description,
      quantity,
      category,
      image,
    },
  })
  res.json(item)
})

app.get('/items', async (req, res) => {
  const items = await prisma.item.findMany()
  res.json(items)
})

app.get('/items/:id', async (req, res) => {
  const { id } = req.params
  const item = await prisma.item.findUnique({
    where: { id: Number(id) },
  })
  res.json(item)
})

app.patch('/items/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, quantity, category, image } = req.body
  const item = await prisma.item.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
      quantity,
      category,
      image,
    },
  });
  res.json(item)
})

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params
  await prisma.item.delete({
    where: { id: Number(id) },
  })
  res.json({ message: 'Item excluído' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
