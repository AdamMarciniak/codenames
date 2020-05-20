
#ssh -v(verbose) -L (localPort):(DBHostname):(remotePort) user@remotehost

ssh -v -L 5433:localhost:5432 postgres@192.99.54.136

