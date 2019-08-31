@Library('jenkings') _

def getNodeHostname() {
  script {
    sh 'hostname -f'
  }
}

def buildDockerImage(image,arch,tag) {
  script {
    img = docker.build("${image}:${tag}", "--pull --build-arg ARCH=${arch} -f docker/Dockerfile .")
  }
}

def pushDockerImage(arch,tag) {
  script {
    docker.withRegistry('https://registry.hub.docker.com', 'bobthabuilda') { 
      img.push("${tag}")
    }
  }
}

pipeline {
  agent { label '!docker-qemu' }
  environment {
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
            img = ''
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
      }
    }  
  }
}