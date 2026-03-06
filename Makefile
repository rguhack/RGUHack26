# Makefile for Docker Compose

# Variables
docker_compose_file = docker-compose.yml
docker_compose_file_dev = docker-compose.local.yml
project_name = liar

# Targets
.PHONY: up down build logs serve shell local-serve clean format

up:
	docker compose -f $(docker_compose_file) down
	docker compose -f $(docker_compose_file) up -d

down:
	docker compose -f $(docker_compose_file) down

build:
	docker compose -f $(docker_compose_file) build

logs:
	docker compose -f $(docker_compose_file) logs -f

serve:
	docker compose -f $(docker_compose_file) down
	docker compose -f $(docker_compose_file) up -d --build
	make clean

local-serve:
	docker compose -f $(docker_compose_file_dev) down
	docker compose -f $(docker_compose_file_dev) up --build

shell:
	docker exec -it $$(docker compose -f $(docker_compose_file) ps -q $(project_name)) sh || bash

clean:
	docker image prune -f
	docker volume prune -f

format:
	prettier --write . --ignore-path .prettierignore
