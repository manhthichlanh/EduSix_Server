class StaticPath {
    path = require("path");
    handlePath = (...args) => {
        return {
            join: this.path.join(...args),
            resolve: this.path.resolve(...args)
        }
    }

    constructor() {
        this._rootSourceDir = __dirname;
        this._publicDir = this.handlePath(this._rootSourceDir, "public").join
        this._videosDir = this.handlePath(this._publicDir, "videos").join
        this._generateVideoPath = (videoObjectId) => {
            this._currentVideoDir = this.handlePath(this._videosDir, videoObjectId).join
            this._segmentsDir = this.handlePath(this._currentVideoDir, "segments").join
            this._thumbnailDir = this.handlePath(this._currentVideoDir, "thumbnail").join
            this._manifestDir = this.handlePath(this._currentVideoDir, "master.m3u8").join
            this._tempDir = this.handlePath(this._currentVideoDir, "temp").join
            return new Promise((resolve, reject) => {
                const createDirectories = async () => {
                    const fs = require("fs");
                    try {
                        await Promise.all([
                            fs.promises.mkdir(this._currentVideoDir, { recursive: true }),
                            fs.promises.mkdir(this._segmentsDir, { recursive: true }),
                            fs.promises.mkdir(this._thumbnailDir, { recursive: true }),
                            fs.promises.mkdir(this._tempDir, { recursive: true })
                        ]);
        
                        resolve({
                            videosDir: this._currentVideoDir,
                            thumbnailDir: this._thumbnailDir,
                            segmentsDir: this._segmentsDir,
                            manifestDir: this._manifestDir,
                            tempDir: this._tempDir
                        });
                    } catch (error) {
                        reject(error);
                    }
                };
        
                createDirectories();
            });
        }
        
    }
}

export default new StaticPath();
