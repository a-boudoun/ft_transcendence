front: 
	npm i -C ./frontend
	npm run dev -C ./frontend
back: 
	# npm i -C ./backend
	npm run start:dev -C ./backend

	# --legacy-peer-deps