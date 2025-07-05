docker build -t trend-wars-backend .
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 592903510708.dkr.ecr.us-west-2.amazonaws.com
docker tag trend-wars-backend 592903510708.dkr.ecr.us-west-2.amazonaws.com/trend-wars-backend
docker push 592903510708.dkr.ecr.us-west-2.amazonaws.com/trend-wars-backend
aws ecs update-service \
  --cluster TrendWarsStack-TrendWarsClusterB24DE657-qNjZZGVb3DF4 \
  --service TrendWarsStack-TrendWarsFargateServiceACB1E9D6-DhLRw7Tkyobh \
  --force-new-deployment


