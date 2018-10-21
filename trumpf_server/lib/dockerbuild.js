var stream = require('stream');
var chalk = require('chalk');

var ChildProcess = require('child_process');
var spawn = ChildProcess.spawn;
var exec = ChildProcess.execSync;

var replace = require('gulp-replace');

const BUILDDIR = 'dockerbuild';

module.exports = function() {

    this.tags = [];
    this.loginfo = true;
    this.builddir = BUILDDIR;

    this.buildNumber = process.env.BUILD_BUILDNUMBER;
    if (!this.buildNumber) {
        this.buildNumber = 'local-build';
    }

    this.repository = 'enbwdocker-on.azurecr.io';
    this.userName = process.env.DOCKER_REG_USER;
    this.password = process.env.SECRET_DOCKER_REG_PASSWORD;

    this.logInfo = function() {

        if (this.loginfo) {
            this.loginfo = false;
            console.log('Dockerbuild:')
            console.log('   buildNumber:         ' + this.buildNumber);
            console.log('   DOCKER_REG:          ' + this.repository);
            console.log('   DOCKER_REG_USER:     ' + this.userName);
            if (this.password) {
                console.log('   DOCKER_REG_PASSWORD: ' + '*****');
            } else {
                console.log('   DOCKER_REG_PASSWORD: ' + 'NULL');
            }
        }
    };

    this.locateDockerBinary = function() {

        if (!this.dockerPath) {
            var result;

            try {
                result = exec('type docker');
                var regex = /(\/.*)/
                var result2 = result.toString().match(regex);
                result = result2[1];
            } catch (e) {
                console.log(chalk.red('Unable to locate docker binary: ' + e));
                throw 'Unable to locate docker binary'
            }

            this.dockerPath = result.toString().trim();
        }

        return this.dockerPath;
    }

    this.build = function(cb) {
        this.logInfo();

        var args = ['build', this.builddir];

        if (this.imageName) {
            var tag;
            if (this.repository) {
                tag = this.repository;
            }
            if (this.imageName) {
                tag += '/' + this.imageName;
            }
            console.log("tag", this.tags)

            if (this.tags) {
                console.log(1,this.tags.length)
                for (var i = 0; i < this.tags.length; i++) {

                    var fulltag = tag + ':' + this.tags[i];
                    console.log("fulltag",fulltag)
                    args.push('-t');
                    args.push(fulltag);
                }
            }
        }

        var cmd = spawn(this.locateDockerBinary(), args);

        cmd.stdout.on('data', function(data) {
            console.log(`${data}`);
        });

        cmd.stderr.on('data', function(data) {
            console.log(chalk.red(`stderr: ${data}`));
        });

        cmd.on('close', function(code) {
            if (code == 0) {
                cb();
            } else {
                cb('child process exited with code ' + code);
            }
        });
    }

    this.push = function(cb) {
        this.logInfo();

        var tags = this.tags;

        this._push(tags, cb);
    };

    this._push = function(tags, cb) {

        if (tags.length == 0) {
            cb();

        } else {
            tag = tags.pop();

            console.log('Pushing tag: ' + tag)

            var args = ['push'];

            if (this.imageName) {
                var target;
                if (this.repository) {
                    target = this.repository;
                }
                if (this.imageName) {
                    target += '/' + this.imageName;
                }
                target += ':' + tag;
                args.push(target);
            }

            var me = this;
            var cmd = spawn(this.locateDockerBinary(), args);

            cmd.stdout.on('data', function(data) {
                console.log(`${data}`);
            });

            cmd.stderr.on('data', function(data) {
                console.log(chalk.red(`stderr: ${data}`));
            });

            cmd.on('close', function(code) {
                if (code == 0) {
                    me._push(tags, cb);
                } else {
                    cb('child process exited with code ' + code);
                }
            });
        }
    };

    this.login = function(cb) {
        this.logInfo();

        var args = ['login'];

        if (this.userName) {
            args.push('-u');
            args.push(this.userName);
            args.push('-p');
            args.push(this.password);
            args.push(this.repository);
        }

        var me = this;
        var cmd = spawn(this.locateDockerBinary(), args);

        cmd.stdout.on('data', function(data) {
            console.log(`${data}`);
        });

        cmd.stderr.on('data', function(data) {
            console.log(chalk.red(`stderr: ${data}`));
        });

        cmd.on('close', function(code) {
            if (code == 0) {
                console.log('login to ' + me.repository + ' OK');
                cb();
            } else {
                cb('child process exited with code ' + code);
            }
        });
    };

    this.withRepository = function(repos) {
        this.repository = repos;
        return this;
    };

    this.withTag = function(tag) {
        this.tags.push(tag);
        return this;
    };

    this.withImage = function(name) {
        this.imageName = name;
        return this;
    };

    this.withUserName = function(name) {
        this.userName = name;
        return this;
    };

    this.withPassword = function(pwd) {
        this.password = pwd;
        return this;
    };

    this.withBuildNumber = function() {
        this.withTag(this.buildNumber);
        return this;
    };

    this.withBuildDir = function(dir) {
        this.builddir = dir;
        return this;
    };

    this.withBuildPath = function(paths, basedir) {
        this.dockerBuildPaths = paths;
        if (basedir == null) {
            this.dockerBuildPathsBase = '.';
        } else {
            this.dockerBuildPathsBase = basedir;
        }
        return this;
    };

    this.withGulp = function(gulp) {
        this.gulp = gulp;

        this.task = this.imageName;
        this.gulpTaskPrefix = this.imageName + '-';

        var me = this;

        gulp.task(this.imageName, [this.gulpTaskPrefix + 'push-after-build',
            me.gulpTaskPrefix + 'replace-deployment'
        ]);

        gulp.task(this.gulpTaskPrefix + 'build', [this.gulpTaskPrefix + 'prepare',
                this.gulpTaskPrefix + 'login'
            ],
            function(cb) {
                me.build(function(err) {
                    cb(err);
                });
            });

        gulp.task(this.gulpTaskPrefix + 'push-only', [this.gulpTaskPrefix + 'login'],
            function(cb) {
                me.push(function(err) {
                    cb(err);
                });
            });

        gulp.task(this.gulpTaskPrefix + 'push-after-build', [this.gulpTaskPrefix + 'login',
                this.gulpTaskPrefix + 'build'
            ],
            function(cb) {
                me.push(function(err) {
                    cb(err);
                });
            });

        gulp.task(this.gulpTaskPrefix + 'login', function(cb) {
            me.login(function(err) {
                if (err) {
                    console.log('failed to login to docker repository', err);
                }
                cb(err);
            });
        });

        gulp.task(this.gulpTaskPrefix + 'prepare', function() {
            return gulp.src(me.dockerBuildPaths, { "base": me.dockerBuildPathsBase })
                .pipe(gulp.dest(me.builddir));
        });

        gulp.task(me.gulpTaskPrefix + 'replace-deployment', function() {});

        return this;
    };

    this.withFilesToPublish = function(gulp, paths) {

        var me = this;

        gulp.task(me.gulpTaskPrefix + 'replace-deployment', function() {
            gulp.src(paths)
                .pipe(replace(/(V__BUILDID__V)/g, me.buildNumber))
                .pipe(gulp.dest('publish'));
        });

        return this;
    };
};