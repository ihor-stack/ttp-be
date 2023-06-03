import { Event } from '../models/Event';
import { Router } from 'express';
import Logzio from '../services/Logzio';

const event = new Event();
const router = new Router();
const logger = Logzio.getInstance();

router.post('/save-event', async (req, res) => {
  try {
    const data = req.body;
    const saveEventId = await event.saveEvent(data);

    logger.info(`save-event`);
    return res.status(201).json(saveEventId);
  } catch (err) {
    logger.error(`save-event: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

router.post('/update-room-dimensions/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const saveEventId = await event.updateRoomDimensions(id, data);

    logger.info(`update-room-dimensions: ${id}`);
    return res.status(201).json(saveEventId);
  } catch (err) {
    logger.error(`update-room-dimensions: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

router.put('/update-event/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const updateEventId = await event.updateEvent(id, data);

    logger.info(`update-event: ${id}`);
    return res.status(201).json(updateEventId);
  } catch (err) {
    logger.error(`update-event: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

router.post('/duplicate-event/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const { title, startDate, endDate } = data;

    const duplicateEventId = await event.duplicateEvent(
      id,
      title,
      startDate,
      endDate
    );

    logger.info(`duplicate-event: ${id}`);
    return res.status(201).json(duplicateEventId);
  } catch (err) {
    logger.error(`duplicate-event: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

router.delete('/delete-event/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deleteRowCount = await event.deleteEvent(id);

    logger.info(`delete-event: ${id}`);
    return res.status(201).json({ rows: deleteRowCount });
  } catch (err) {
    logger.error(`delete-event: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

router.put('/favorite-event/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const saveFavoriteEventId = await event.addFavoriteEvent(id);

    logger.info(`add-favorite-event: ${id}`);
    return res.status(201).json(saveFavoriteEventId);
  } catch (err) {
    logger.error(`add-favorite-event: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

router.put('/unfavorite-event/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const removeFavoriteEventId = await event.removeFavoriteEvent(id);

    logger.info(`remove-favorite-event: ${id}`);
    return res.status(201).json(removeFavoriteEventId);
  } catch (err) {
    logger.error(`remove-favorite-event: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
});

router.get('/get-events', async (req, res) => {
  try {
    const getEvents = await event.getEvents();
    logger.info(`get-events`);
    return res.status(200).json(getEvents);
  } catch (err) {
    logger.error(`get-events: ${err.message}`);
    return res.status(404).json({ error: err.message });
  }
});

router.get('/get-event/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const getEvent = await event.getEvent(id);

    logger.info(`get-event: ${id}`);
    return res.status(200).json(getEvent);
  } catch (err) {
    logger.error(`get-event: ${err.message}`);
    return res.status(404).json({ error: err.message });
  }
});

router.get('/get-event-shared/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const getEvent = await event.getEventByShareId(id);

    logger.info(`get-event: ${id}`);
    return res.status(200).json(getEvent);
  } catch (err) {
    logger.error(`get-event: ${err.message}`);
    return res.status(404).json({ error: err.message });
  }
});

router.post('/save-furniture/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const furniture = req.body;

    const getEvent = await event.saveFurniture(id, furniture);

    logger.info(`save-furniture: ${id}`);
    return res.status(201).json(getEvent);
  } catch (err) {
    logger.error(`save-furniture: ${err.message}`);

    return res.status(400).json({ error: err.message });
  }
});

router.get('/favorite-events', async (req, res) => {
  try {
    const getEvents = await event.getFavoriteEvents();
    logger.info(`get-favorite-events`);
    return res.status(200).json(getEvents);
  } catch (err) {
    logger.error(`get-favorite-events: ${err.message}`);
    return res.status(404).json({ error: err.message });
  }
});

router.get('/get-tables', async (req, res) => {
  try {
    const getTables = await event.getTables();
    logger.info(`get-tables`);
    return res.status(200).json(getTables);
  } catch (err) {
    logger.error(`get-tables: ${err.message}`);
    return res.status(404).json({ error: err.message });
  }
});

router.get('/get-chairs', async (req, res) => {
  try {
    const getChairs = await event.getChairs();
    logger.info(`get-chairs`);
    return res.status(200).json(getChairs);
  } catch (err) {
    logger.error(`get-chairs: ${err.message}`);
    return res.status(404).json({ error: err.message });
  }
});

export default router;
