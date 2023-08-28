front: 
	npm i -C ./frontend
	npm run dev -C ./frontend
back: 
	npm i --legacy-peer-deps -C ./backend
	npm run start:dev -C ./backend 