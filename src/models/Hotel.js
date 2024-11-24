import { DataTypes } from 'sequelize';
import sequelize from '../../db/db.js';

const Hotel = sequelize.define('Hotel', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  stars: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true, 
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true, 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  placeId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumb: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  amenities: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pois: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
  reviews: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
  category: {  
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, 
  },
});

export default Hotel;