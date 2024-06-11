#Partimos de la imagen oficial de Ruby (lenguaje de programacion)
FROM ruby:3.0

ENV RAILS_ENV=development \
    RAILS_ROOT=/app

WORKDIR $RAILS_ROOT

# Instalar paquetes requeridos
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Con Ruby es posible instalar Rails (Framework para desarrollo web)
RUN gem install rails

# Creacion de aplicacion - BD postgres
RUN rails new . --database=postgresql --skip-bundle

# Instalar dependencias (similar a npm install)
RUN bundle install

# Exponer el puerto 3000
EXPOSE 3000

# Iniciar le servidor
CMD ["rails", "server", "-b", "0.0.0.0"]
