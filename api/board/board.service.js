import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

const PAGE_SIZE = 3

async function query(filterBy = { txt: '' }) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('board')
    var boards = await collection.find(criteria).toArray()
    // const boards = boardCursor.toArray()
    // console.log('boards', boards)
    console.log('AAAAAAAAAAAAAAAAAAAAAA')

    return boards
  } catch (err) {
    logger.error('cannot find boards', err)
    throw err
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    const board = collection.findOne({ _id: ObjectId(boardId) })
    return board
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err)
    throw err
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.deleteOne({ _id: ObjectId(boardId) })
    return boardId
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err)
    throw err
  }
}

async function add(board) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.insertOne(board)
    return board
  } catch (err) {
    logger.error('cannot insert board', err)
    throw err
  }
}

async function update(board) {
  try {
    const boardToSave = {
      title: board.title,
      isStarred: board.isStarred,
      archivedAt: board.archivedAt,
      imgUrl: board.imgUrl,
      createdBy: board.createdBy,
      style: board.style,
      labels: board.labels,
      members: board.members,
      groups: board.groups,
      activities: board.activities,
    }
    const collection = await dbService.getCollection('board')
    await collection.updateOne({ _id: ObjectId(board._id) }, { $set: boardToSave })
    return board
  } catch (err) {
    logger.error(`cannot update board ${boardId}`, err)
    throw err
  }
}

async function addBoardMsg(boardId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('board')
    await collection.updateOne({ _id: ObjectId(boardId) }, { $push: { msgs: msg } })
    return msg
  } catch (err) {
    logger.error(`cannot add board msg ${boardId}`, err)
    throw err
  }
}

async function removeBoardMsg(boardId, msgId) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.updateOne({ _id: ObjectId(boardId) }, { $pull: { msgs: { id: msgId } } })
    return msgId
  } catch (err) {
    logger.error(`cannot add board msg ${boardId}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  return criteria
}

export const boardService = {
  remove,
  query,
  getById,
  add,
  update,
  addBoardMsg,
  removeBoardMsg,
}
