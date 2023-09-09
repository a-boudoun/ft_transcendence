VOLUMES = $(shell docker volume ls -q)

stop:
	@docker-compose down
	@docker volume rm $(VOLUMES)
	@docker rm -f $(docker ps -a -q)
