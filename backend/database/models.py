from database import db

class Archivo(db.Model):
    __tablename__ = "archivos"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    
    hojas = db.relationship("Hoja", backref="archivo", cascade="all, delete-orphan")

class Hoja(db.Model):
    __tablename__ = "hojas"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    archivo_id = db.Column(db.Integer, db.ForeignKey("archivos.id"), nullable=False)

    datos = db.relationship("Data", backref="hoja", cascade="all, delete-orphan")

class Data(db.Model):
    __tablename__ = "datos"
    id = db.Column(db.Integer, primary_key=True)
    sheet_id = db.Column(db.Integer, db.ForeignKey("hojas.id"), nullable=False)
    columna = db.Column(db.String(255), nullable=False)
    valor = db.Column(db.Text, nullable=True)

class Datos(db.Model):
    __tablename__ = "datos"  
    __table_args__ = {'extend_existing': True}  

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    columna1 = db.Column(db.String(255))  
    columna2 = db.Column(db.String(255))  
    columna3 = db.Column(db.String(255))  

    def to_dict(self):
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}

class DatosExcel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255))  
    dato = db.Column(db.String(255))