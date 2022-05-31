class Tree {
  context = {
    rootId: null,
    idKey: null,
    parentKey: null,
    orderKey: null
  }
  originalData = []
  resolvedData = null

  constructor(rootId, idKey, parentKey, orderKey, data) {
    this.context.rootId = rootId
    this.context.idKey = idKey
    this.context.parentKey = parentKey
    this.context.orderKey = orderKey

    this.originalData = JSON.parse(JSON.stringify(data))
    this.resolvedData = JSON.parse(JSON.stringify({ children: [] }))
    this.setData()
  }

  setData = () => {
    const depth1 = this.originalData.filter(
      d => d[this.context.parentKey] === this.context.rootId
    )
    if (this.context.orderKey) {
      depth1.sort((a, b) => a[this.context.orderKey] - b[this.context.orderKey])
    }
    depth1.forEach(item => {
      this.resolveTreeData(item, this.resolvedData)
    })
  }

  resolveTreeData = (item, tree) => {
    if (!item.children) {
      item.children = []
    }
    tree.children.push(item)

    const children = this.originalData.filter(
      d => d[this.context.parentKey] === item[this.context.idKey]
    )
    if (this.context.orderKey) {
      children.sort(
        (a, b) => a[this.context.orderKey] - b[this.context.orderKey]
      )
    }

    children.forEach(child => {
      this.resolveTreeData(child, item)
    })
  }

  getData = () => {
    return this.resolvedData.children
  }
}

export function getTreeData(context, data) {
  if (!context.rootId || !context.idKey || !context.parentKey) {
    console.error('[TreeUtil] required context')
    return []
  }
  const tree = new Tree(
    context.rootId,
    context.idKey,
    context.parentKey,
    context.orderKey,
    data
  )
  return tree.getData()
}
