import db from '../models/index.js'

export async function createDefaultService(services) {
  for (const serviceName of services){
    await db.Service.findOrCreate({
      where: { name: serviceName },
      defaults: { name: serviceName },
    })
  }
}

export async function createService(req, res) {
  try {
    const { name } = req.body
    const createdService = await db.Service.create({ name })
    res.status(201).json(createdService)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao criar o serviço.' })
  }
}

export async function getServiceById(req, res) {
  try {
    const serviceId = req.params.id
    const service = await db.Service.findByPk(serviceId)
    if (!service) {
      res.status(404).json({ error: 'Serviço não encontrado.' })
      return
    }
    res.json(service)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar o serviço.' })
  }
}

export async function getAllServices(req, res) {
  try {
    const services = await db.Service.findAll()
    res.json(services)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar os serviços.' })
  }
}

export async function updateService(req, res) {
  try {
    const serviceId = req.params.id
    const { name } = req.body
    const service = await db.Service.findByPk(serviceId)
    if (!service) {
      res.status(404).json({ error: 'Serviço não encontrado.' })
      return
    }
    service.name = name
    await service.save()
    res.json(service)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao atualizar o serviço.' })
  }
}

export async function deleteService(req, res) {
  try {
    const serviceId = req.params.id
    const service = await db.Service.findByPk(serviceId)
    if (!service) {
      res.status(404).json({ error: 'Serviço não encontrado.' })
      return
    }
    await service.destroy()
    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao excluir o serviço.' })
  }
}
