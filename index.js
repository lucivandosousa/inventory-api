const express = require('express')
const { PrismaClient } = require('@prisma/client')
const cors = require('cors')

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 9999

app.use(express.json())
app.use(cors())

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
