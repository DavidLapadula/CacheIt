

// snippet object model

module.exports = function(sequelize, DataTypes) {
    let tagObj = sequelize.define("tagObj", {
        tagName: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate: {
                len: [1, 20]
            }
        }
    });

    tagObj.associate = function(models) {
        tagObj.belongsTo(models.cacheObj, { 
        foreignKey: {
          allowNull: false, 
        },
        onDelete: "cascade"
      }); 
    };  
 
    return tagObj;
};