module.exports = {
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: 'tinzarpaing@gmail.com',
    cluster: false,
    approveDomains: (opts, certs, cb) => {
      if (certs) {
        opts.domains = ['lumiereapp.ca'];
      } else {
        opts.email = 'tinzarpaing@gmail.com';
        opts.agreeTos = true;
      }
      cb(null, { options: opts, certs });
    }
};