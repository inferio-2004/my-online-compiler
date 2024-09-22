FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
gcc \
g++ \
default-jdk \
python3 \
curl

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs

WORKDIR /usr/src/app

RUN mkdir -p usr/src/app/files

COPY wrapper.sh /usr/local/bin/wrapper.sh
RUN chmod +x /usr/local/bin/wrapper.sh

CMD ["bash"]