# 小猫成长记

这是一个 React + Vite 的电子宠物小猫应用。现在已经补上了一个轻量后端，用来把整份宠物存档写入本地 JSON 文件，方便后续打包成 Docker 镜像后持久化数据。

## 数据存储

- 前端会优先读写后端接口 `/api/state`
- 后端会把数据保存到 `PET_DATA_FILE` 指定的文件
- 当后端暂时不可用时，前端会继续回退到浏览器本地缓存，不会直接卡死

默认开发落盘位置：

```txt
data/pet-state.json
```

## 本地开发

先启动后端：

```bash
pnpm dev:server
```

再启动前端：

```bash
pnpm dev
```

前端开发服务器会把 `/api/*` 代理到 `http://127.0.0.1:4300`。

## 生产构建

```bash
pnpm build
pnpm start
```

`pnpm start` 会启动 Node 服务，并直接托管 `dist/` 静态文件和 `/api/state` 存档接口。

## Docker

直接构建：

```bash
docker build -t cat-pet-growth .
docker run -d -p 4173:4173 -v $(pwd)/docker-data:/data --name cat-pet-growth cat-pet-growth
```

或者使用：

```bash
docker compose up -d --build
```

容器内默认存档位置：

```txt
/data/pet-state.json
```

## GitHub / Docker 镜像发布

项目已经准备好首版镜像发布流程。代码推到 `main` 后，GitHub Actions 会同步构建并推送：

- `ghcr.io/weidaye1122/electronic-pet-cat:0.1`
- `ghcr.io/weidaye1122/electronic-pet-cat:latest`
- `weidaye1122/electronic-pet-cat:0.1`
- `weidaye1122/electronic-pet-cat:latest`

首次启用前，只需要在 GitHub 仓库的 `Settings > Secrets and variables > Actions` 里补一个仓库密钥：

```txt
DOCKERHUB_TOKEN
```

GitHub Container Registry 直接使用仓库自带的 `GITHUB_TOKEN`，不需要额外配置。

## 群晖 Docker Compose

项目里已经额外准备好了一个群晖专用文件：

```txt
compose.synology.yaml
```

默认使用 Docker Hub 镜像：

```yaml
image: weidaye1122/electronic-pet-cat:latest
```

如果你后面改用 GitHub Container Registry，只需要改成：

```yaml
image: ghcr.io/weidaye1122/electronic-pet-cat:latest
```

群晖持久化目录默认写成：

```txt
/volume1/docker/electronic-pet-cat
```

在群晖 Container Manager 里导入这个文件后，就会把存档保存到这个目录下面的：

```txt
/volume1/docker/electronic-pet-cat/pet-state.json
```
