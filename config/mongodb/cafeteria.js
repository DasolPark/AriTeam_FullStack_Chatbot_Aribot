module.exports = function(Schema){

  CafeteriaSchema = new Schema({
    number: {type: Number},
    date: {type: Number},
    part: {type: String, default: ''},
    menu: {type: String, default: ''}
  });
  console.log('CafeteriaSchema 정의되었음');

  CafeteriaSchema.plugin(autoIncrement.plugin, {model: 'Cafeteria', field: 'number'});//add autoInc
  CafeteriaModel = mongoose.model('Cafeteria', CafeteriaSchema);
  console.log('CafeteriaModel 정의되었음');

  return CafeteriaModel;
}
