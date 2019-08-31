@Library('jenkings') _

def getNodeHostname() {
  script {
    sh 'hostname -f'
  }
}

def buildDockerImage(image,arch,tag) {
  script {
    img = docker.build("${image}:${arch}-${tag}", "--pull --build-arg ARCH=${arch} -f docker/Dockerfile .")
  }
}

def pushDockerImage(arch,tag) {
  script {
    docker.withRegistry('https://registry.hub.docker.com', 'bobthabuilda') { 
      img.push("${arch}-${tag}")  
    }
  }
}

pipeline {
  agent { label '!docker-qemu' }
  environment {
    img = ''
    image = 'majorcadevs/ecosia-treeminer'
    chatId = ''
  }

  stages {

    stage('Preparation') {
      steps {
        setBuildStatus 'Image build', 'PENDING', 'https://github.com/majorcadevs/ecosia-treeminer'
      }
    }

    stage ('Build Docker Images') {

        parallel {
          stage ('docker-amd64') {
            agent {
              label 'docker-qemu'
            }

            environment {
              arch = 'amd64'
              tag = 'latest'
            }

            stages {

              stage ('Current Node') {
                steps {
                  getNodeHostname()
                }
              }

              stage ('Build') {
                steps {
                  buildDockerImage(image,arch,tag)
                }
              }

              stage ('Push') {
                steps {
                  pushDockerImage(arch,tag)
                }
              }
            }
          }

          stage ('docker-arm64') {
            agent {
              label 'docker-qemu'
            }

            environment {
              arch = 'arm64v8'
              tag = 'latest'
            }

            stages {

              stage ('Current Node') {
                steps {
                  getNodeHostname()
                }
              }

              stage ('Build') {
                steps {
                  buildDockerImage(image,arch,tag)
                }
              }

              stage ('Push') {
                steps {
                  pushDockerImage(arch,tag)
                }
              }
            }
          }

          stage ('docker-arm32') {
            agent {
              label 'docker-qemu'
            }

            environment {
              arch = 'arm32v7'
              tag = 'latest'
            }

            stages {

              stage ('Current Node') {
                steps {
                  getNodeHostname()
                }
              }

              stage ('Build') {
                steps {
                  buildDockerImage(image,arch,tag)
                }
              }

              stage ('Push') {
                steps {
                  pushDockerImage(arch,tag)
                }
              }
            }
          }
        }
    }

    stage('Update manifest') {

      agent {
        label 'docker-qemu'
      }

      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'bobthabuilda') {
            getNodeHostname()  
            sh 'docker manifest create majorcadevs/ecosia-treeminer:latest majorcadevs/ecosia-treeminer:amd64-latest majorcadevs/ecosia-treeminer:arm32v7-latest majorcadevs/ecosia-treeminer:arm64v8-latest'
            sh 'docker manifest push -p majorcadevs/ecosia-treeminer:latest'
          }
        }
      }
    }  
  }
}