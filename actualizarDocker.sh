#!/bin/bash

set -e

for compose in dockerCompose*.yml; do
  # Extraer el nombre base (por ejemplo, Desarrollo de dockerComposeDesarrollo.yml)
  base=$(echo "$compose" | sed -E 's/^dockerCompose(.*)\.yml$/\1/I')
  env_example=".env.${base}"
  echo "Actualizando tienda: $base"
  env_dest=".env"

  # Si existe el archivo de ejemplo, lo copia al .env correspondiente
  if [ -f "$env_example" ]; then
    echo "Copiando $env_example a $env_dest"
    cp "$env_example" "$env_dest"
  fi

  echo "Bajando y borrando imágenes y volúmenes de $compose"
  docker compose -f "$compose" down --rmi all --volumes
  echo "Levantando $compose"
  docker compose -f "$compose" up --build -d

#   //despues de levantar la tienes elimiarn el .env 
    if [ -f "$env_dest" ]; then
        echo "Eliminando $env_dest"
        rm "$env_dest"
    fi
    echo "Tienda $base actualizada."
done

echo "Todas las tiendas han sido actualizadas."