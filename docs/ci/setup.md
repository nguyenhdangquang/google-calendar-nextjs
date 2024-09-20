## Setting up Workload Identity Federation

Need to follow [these steps](https://github.com/google-github-actions/auth#setting-up-workload-identity-federation) to setup Workload Identity Federation to use with Github Actions

Below are commands in the steps:

```bash
export PROJECT_ID="level-clone-349910"

gcloud iam service-accounts create "github-actions" \
  --project "${PROJECT_ID}"

gcloud services enable iamcredentials.googleapis.com \
  --project "${PROJECT_ID}"

gcloud iam workload-identity-pools create "github" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --display-name="Github"

gcloud iam workload-identity-pools describe "github" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --format="value(name)"

export WORKLOAD_IDENTITY_POOL_ID=projects/42708300348/locations/global/workloadIdentityPools/github

gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="github" \
  --display-name="Github provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

export REPO_FRONTEND=zenith-project/zenith-frontend
export REPO_BACKEND=zenith-project/zenith-backend

gcloud iam service-accounts add-iam-policy-binding "github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project="${PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${REPO_FRONTEND}"

gcloud iam service-accounts add-iam-policy-binding "github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project="${PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${REPO_BACKEND}"


gcloud iam workload-identity-pools providers describe "github-provider" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="github" \
  --format="value(name)"
```

## Dockerfiles and multi env

- [ ] Need to follow [this repo](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env) to create Dockerfile for both frontend and backend projects

- [ ] `google-github-actions` issue for reference to setup build step: https://github.com/google-github-actions/auth/issues/50
