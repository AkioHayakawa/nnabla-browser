import pathOperator from '../../utils/pathOperator'

const Path = require('path')

const createNewNode = (name) => {
  return {
    name: name,
    children: [],
    monitorFiles: [],
    nntxtFiles: [],
    csvResultFiles: []
  }
}

const createNewSubTree = (relPath, insertData) => {
  const split = relPath.split('/')

  const subTree = createNewNode(split[0])
  let currentNode = subTree
  let i
  for (i = 1; i < split.length - 1; i++) {
    const dir = split[i]

    const tmp = createNewNode(dir)
    currentNode.children.push(tmp)
    currentNode = tmp
  }

  const fileType = pathOperator.getFileType(split[i])
  currentNode[fileType].push({ name: split[i], data: insertData })

  return subTree
}

const searchParent = (path, graph) => {
  const split = path.split('/')

  let currentNode = graph
  let i
  for (i = 0; i < split.length - 1; i++) {
    const dir = split[i]

    const nextNode = currentNode.children.find(x => x.name === dir)

    if (typeof nextNode === 'undefined') {
      break
    }

    currentNode = nextNode
  }

  return [currentNode, split.slice(i, split.length).join('/')]
}

const findInsertIndex = (list, name) => {
  let insertIndex = list.findIndex(x => x.name.toLowerCase() > name.toLowerCase())
  insertIndex = insertIndex > -1 ? insertIndex : list.length

  return insertIndex
}

const insertFile = (parent, fileName, insertData) => {
  const fileType = pathOperator.getFileType(fileName)

  if (fileType) {
    const index = parent[fileType].findIndex(x => x.name === fileName)
    if (index > -1) {
      parent[fileType][index].data = Object.assign({}, parent[fileType][index].data, insertData)
    } else {
      const insertIndex = findInsertIndex(parent[fileType], fileName)
      parent[fileType].splice(insertIndex, 0, { name: fileName, data: insertData })
    }
  }
}

const deleteDirectoryInfo = (parent, fileName, fileType) => {
  const index = parent[fileType].findIndex(x => x.name === fileName)
  if (index > -1) {
    parent[fileType].splice(index, 1)

    return true
  }

  return false
}

const state = {
  data: {
    children: [],
    name: '',
    nntxtFiles: [],
    monitorFiles: [],
    csvResultFiles: []
  },
  activeFile: ''
}

const mutations = {
  addDirectoryInfo: function (state, { path, data }) {
    const [parent, relPath] = searchParent(path, state.data)

    if (relPath.split('/').length === 1) {
      insertFile(parent, relPath, data)
    } else {
      const subTree = createNewSubTree(relPath, data)
      const insertIndex = findInsertIndex(parent.children, relPath.split('/')[0])
      parent.children.splice(insertIndex, 0, subTree)
    }
  },
  updateActiveFile: function (state, path) {
    state.activeFile = path
  },
  resetActiveFile: function (state) {
    state.activeFile = ''
  }
}

const actions = {
  deleteDirectoryInfo: function ({ commit, state }, { path }) {
    const [parent, dirName] = searchParent(path, state.data)

    let fileType = pathOperator.getFileType(dirName)
    if (!fileType) fileType = 'children'

    if (deleteDirectoryInfo(parent, dirName, fileType)) {
      if (Path.relative(path, state.activeFile).length < state.activeFile.length) {
        // active file is under deleted folder.
        // reset current display.

        d3.select('#network-editor')
          .transition().duration(500).attr('opacity', 0)
          .on('end', () => {
            commit('resetActiveFile')
            commit('resetGraphs')
            commit('resetNNtxtPath')
          })
      }
    }
  }
}

const directoryInfoModule = {
  state,
  mutations,
  actions
}

export default directoryInfoModule
