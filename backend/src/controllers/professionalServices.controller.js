const professionalServicesRepository = require("../database/professionalServices.repository");

async function listServicesForProfessional(req, res) {

  console.log("SESSION USER:", req.session.user);

  const professionalId = req.params.id;
  const companyId = req.session.user.companyId;

  try {

    const services = await professionalServicesRepository.listServicesForProfessional(
      companyId,
      professionalId
    );

    res.json(services);

  } catch (err) {

    console.error("Erro ao listar serviços do profissional", err);
    res.status(500).json({ error: "Erro interno do servidor" });

  }

}


async function addServiceToProfessional(req, res) {

  const professionalId = req.params.id;
  const companyId = req.session.user.companyId;
  const { serviceId, customPrice } = req.body;

  try {

    await professionalServicesRepository.addServiceToProfessional(
      companyId,
      professionalId,
      serviceId,
      customPrice
    );

    res.json({ success: true });

  } catch (err) {

    console.error("Erro ao adicionar serviço ao profissional", err);
    res.status(500).json({ error: "Erro interno do servidor" });

  }

}


async function removeServiceFromProfessional(req, res) {

  const professionalId = req.params.id;
  const serviceId = req.params.serviceId;
  const companyId = req.session.user.companyId;

  try {

    await professionalServicesRepository.removeServiceFromProfessional(
      companyId,
      professionalId,
      serviceId
    );

    res.json({ success: true });

  } catch (err) {

    console.error("Erro ao remover serviço do profissional", err);
    res.status(500).json({ error: "Erro interno do servidor" });

  }

}


module.exports = {
  listServicesForProfessional,
  addServiceToProfessional,
  removeServiceFromProfessional
};