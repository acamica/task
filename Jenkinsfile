pipeline {
    agent any
    tools {
        nodejs 'Node 10.13.0'
    }

    environment {
        NPM_TOKEN     = credentials('acamica-npm-token')
        REGISTRY      = credentials('acamica-registry-password')
        CI            = '1' // semantic release need this environment
    }

    stages {

        stage('Install dependencies') {
            steps {
                sh "echo //registry.npmjs.org/:_authToken=\${NPM_TOKEN} > .npmrc"
                sh 'npm whoami'
                sh 'npm doctor'
                sh 'npm ci'
                sh 'rm .npmrc'
            }
        }
        
        stage('Build NPM Package') {
            steps {
                sh "echo //registry.npmjs.org/:_authToken=\${NPM_TOKEN} > .npmrc"
		script { try {
                  sh './npm-push.sh'
                } catch (err) {
                  echo "el paquete no se pudo publicar, verificar si ya existe"
                } }
                sh 'rm .npmrc'
            }
        }
    }

    post {
        success {
            slackSend channel: env.SLACK_SUCC_CHANNEL, color: 'good', message: "Build finished successfully : ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.JOB_URL}|Open>)"
        }
        failure {
            slackSend channel: env.SLACK_ERR_CHANNEL, color: '#FF0000', message: "Build failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.JOB_URL}|Open>)"
        }
    }
}

