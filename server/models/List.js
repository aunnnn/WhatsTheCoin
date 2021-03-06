const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ListSchema = Schema({

  // From CMC
  cmc_id: String,
  cmc_asset_id: String,
  name: String,
  symbol: String,  
  rank: Number,

  submitted_definitions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Definition',
      default: [],
    }
  ],

  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    }
  ],

  definitions_count: {
    type: Number,
    required: true,
    default: 0,
  },
  
  latest_definition_added: {
    type: Date,
    required: false,
  },
})

const initCollection = () => {
  if(mongoose.models.List) {
    return mongoose.model('List')
  } else {
    return mongoose.model('List', ListSchema)
  }
}

const model = initCollection()
model.Schema = ListSchema
module.exports = model
