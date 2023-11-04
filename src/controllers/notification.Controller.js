import Notifications from "../models/Notifications";

exports.crearNotification = async (req, res) => {
    console.log(req.body.notification, 'notification')
    try {
        const newNotification = new Notifications(req.body.notification);
        //guardar newNotification
        await newNotification.save();
        //pata la nueva lista de notification
        const notificationData = await Notifications.find({});
        return res.json({ msg: "Notification Creado Correctamente.", notificationData });
    } catch (error) {
      console.log("error");
      res.status(400).send("Hubo un error");
    }
  };

// Listar notifications
exports.notificationList = async (req, res) => {
  try {
      const notificationData = await Notifications.find({}).sort({createdAt:-1});
      res.json({ notificationData });
  } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: 'Hubo un error en el Servidor, Listado de Notifications.' });
  }
}