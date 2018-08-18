// making the model for the entire cache object
module.exports = function(sequelize, DataTypes) {
    let cacheObj = sequelize.define('cacheObj', {
      URL: {
        type: DataTypes.STRING(4096),
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
 
    cacheObj.associate = function(models) {
      cacheObj.hasMany(models.tagObj, {
          onDelete: 'cascade'
      }); 
  }; 
    return cacheObj; 
  };