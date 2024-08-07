from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

Base = declarative_base()
engine = create_engine('sqlite:///database/chat.db', echo=True)
Session = sessionmaker(bind=engine)
session = Session()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)
    avatar = Column(String)
    online = Column(Boolean, default=False)

class Message(Base):
    __tablename__ = 'messages'
    id = Column(Integer, primary_key=True)
    sender = Column(String)
    receiver = Column(String)
    content = Column(Text)
    timestamp = Column(String)

Base.metadata.create_all(engine)

def broadcast_user_list():
    users = session.query(User).all()
    user_list = [{'username': user.username, 'avatar': user.avatar, 'online': user.online} for user in users]
    socketio.emit('user_list', user_list, namespace='/')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    avatar = data['avatar']
    user = User(username=username, password=password, avatar=avatar)
    session.add(user)
    session.commit()
    broadcast_user_list()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    user = session.query(User).filter_by(username=username, password=password).first()
    if user:
        if user.online:
            return jsonify({'message': 'User already logged in'}), 403
        user.online = True
        session.commit()
        broadcast_user_list()
        return jsonify({'message': 'Login successful', 'username': username, 'avatar': user.avatar}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    data = request.json
    username = data['username']
    user = session.query(User).filter_by(username=username).first()
    if user:
        user.online = False
        session.commit()
        broadcast_user_list()
        return jsonify({'message': 'Logout successful'}), 200
    return jsonify({'message': 'User not found'}), 404

@app.route('/history/<username1>/<username2>', methods=['GET'])
def get_chat_history(username1, username2):
    messages = session.query(Message).filter(
        ((Message.sender == username1) & (Message.receiver == username2)) |
        ((Message.sender == username2) & (Message.receiver == username1))
    ).order_by(Message.timestamp).all()
    
    history = [{'sender': msg.sender, 'receiver': msg.receiver, 'content': msg.content, 'timestamp': msg.timestamp} for msg in messages]
    return jsonify(history), 200

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
    username = request.args.get('username')
    if username:
        user = session.query(User).filter_by(username=username).first()
        if user:
            user.online = False
            session.commit()
            broadcast_user_list()

@socketio.on('join')
def on_join(data):
    username = data['username']
    user = session.query(User).filter_by(username=username).first()
    if user:
        user.online = True
        session.commit()
    join_room(username)
    emit('user_joined', {'username': username}, broadcast=True, namespace='/')
    broadcast_user_list()

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    leave_room(username)
    user = session.query(User).filter_by(username=username).first()
    if user:
        user.online = False
        session.commit()
    emit('user_left', {'username': username}, broadcast=True, namespace='/')
    broadcast_user_list()

@socketio.on('message')
def handle_message(data):
    sender = data['sender']
    receiver = data['receiver']
    content = data['content']
    timestamp = datetime.datetime.now().isoformat()
    
    message = Message(sender=sender, receiver=receiver, content=content, timestamp=timestamp)
    session.add(message)
    session.commit()
    
    emit('message', data, room=receiver)
    emit('message', data, room=sender)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
