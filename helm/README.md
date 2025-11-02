# modai-app Helm Chart

This chart deploys the `modai-app` Flask application to a Kubernetes cluster.

## Prerequisites

*   Kubernetes cluster (e.g., Minikube, Docker Desktop Kubernetes, GKE, EKS)
*   Helm 3+
*   `kubectl` configured to connect to your cluster

## Installing the Chart

To install the chart with the release name `my-release`:

```bash
helm install my-release ./helm
```

## Configuration

The following table lists the configurable parameters of the `modai-app` chart and their default values. These can be overridden by providing a custom `values.yaml` file or by using the `--set` flag during `helm install` or `helm upgrade`.

| Key                 | Type    | Default       | Description                                                              |
| :------------------ | :------ | :------------ | :----------------------------------------------------------------------- |
| `replicaCount`      | `int`   | `1`           | Number of application replicas to deploy.                                |
| `image.repository`  | `string`| `modai-app`   | Docker image repository.                                                 |
| `image.pullPolicy`  | `string`| `IfNotPresent`| Image pull policy.                                                       |
| `image.tag`         | `string`| `"latest"`    | Docker image tag.                                                        |
| `service.type`      | `string`| `NodePort`    | Kubernetes Service type (`ClusterIP`, `NodePort`, `LoadBalancer`).       |
| `service.port`      | `int`   | `5001`        | Port the service exposes.                                                |
| `ingress.enabled`   | `bool`  | `false`       | Enable Ingress controller for external access.                           |
| `ingress.className` | `string`| `""`          | Ingress class name.                                                      |
| `ingress.annotations`| `object`| `{}`          | Annotations for the Ingress resource.                                    |
| `ingress.hosts`     | `list`  | `[]`          | List of hostnames for the Ingress.                                       |
| `resources`         | `object`| `{}`          | Resource requests and limits for the application container.              |
| `autoscaling.enabled`| `bool`  | `false`       | Enable Horizontal Pod Autoscaler.                                        |
| `autoscaling.minReplicas`| `int`   | `1`           | Minimum number of replicas for autoscaling.                              |
| `autoscaling.maxReplicas`| `int`   | `10`          | Maximum number of replicas for autoscaling.                              |
| `autoscaling.targetCPUUtilizationPercentage`| `int`   | `80`          | Target CPU utilization for autoscaling.                                  |

## Upgrading the Chart

To upgrade an existing release:

```bash
helm upgrade my-release ./helm
```

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```bash
helm uninstall my-release
```

## Example Usage with Custom Values

To install the chart with a custom image tag and 3 replicas:

```bash
helm install my-release ./helm --set image.tag=v1.0.0 --set replicaCount=3
```

Alternatively, you can create a `custom-values.yaml` file:

```yaml
# custom-values.yaml
image:
  tag: v1.0.0
replicaCount: 3
```

And then install with:

```bash
helm install my-release ./helm -f custom-values.yaml
```
