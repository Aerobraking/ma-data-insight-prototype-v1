import { createStore } from 'vuex'

export default createStore({
  state: {
    dragOffsetX: 1,
    dragOffsetY: 1,
    views: [
      {
        history: [] as any,
        type: "workspace",
        key: 0,
        name: "Workspace default",
        isActive: true,
        initialZoom: 1,
        initialX: 0,
        initialY: 0,
        nodes: [
          {
            key: "2431512", name: "Hallo 1", x: Math.random() * 500,
            y: Math.random() * 500, isSelected: false
          },
          {
            key: "523345", name: "Welt", x: Math.random() * 500,
            y: Math.random() * 500, isSelected: false
          }]
      }, {
        history: [] as any,
        type: "workspace",
        key: 1,
        name: "Hobby",
        isActive: false,
        initialZoom: 0.5,
        initialX: 300,
        initialY: 500,
        nodes: [
          {
            key: "3458", name: "Welt 2", x: Math.random() * 500,
            y: Math.random() * 500, isSelected: false
          }]
      }, {
        history: [] as any,
        type: "workspace",
        key: 2,
        name: "Workspace Arbeit",
        isActive: false,
        initialZoom: 1.5,
        initialX: 300,
        initialY: 500,
        nodes: [
          {
            key: "315", name: "Welt 3", x: Math.random() * 500,
            y: Math.random() * 500, isSelected: false
          },
          {
            key: "1234", name: "Welt", x: Math.random() * 500,
            y: Math.random() * 500, isSelected: false
          },
          {
            key: "1347", name: "Welt1", x: Math.random() * 500,
            y: Math.random() * 500, isSelected: false
          }]
      }, {
        history: [] as any,
        type: "overview",
        key: 3,
        name: "Overview",
        isActive: false,
        initialZoom: 0.1,
        initialX: 300,
        initialY: 500,
        nodes: [
          {
            key: "1235", name: "Welt 4", x: Math.random() * 500,
            y: Math.random() * 500, isSelected: false
          },
          {
            key: "15358", name: "Welt1", x: Math.random() * 500,
            y: Math.random() * 500, isSelected: false
          },
          {
            key: "3648", name: "Welt", x: Math.random() * 500,
            y: Math.random() * 500, isSelected: false
          }]
      }
    ],
    selectedViewIndex: 0

  },
  getters: {
    getView: (state, getters) => (viewKey: any) => {
      var vF = null;
      state.views.forEach(v => {
        if (v.key === viewKey) {
          vF = v;
        }
      });
      return vF;
    },
    getViewList(state) {
      return state.views;
    }
  },
  mutations: {
    setIsSelected(state, payload) {
      for (let [index, element] of payload.view.nodes.entries()) {
        var e: any = element;
        if (payload.add) {
          if (e.key === payload.name) {
            e.isSelected = !e.isSelected;
          }
        } else {
          e.isSelected = e.key === payload.name;
        }
      }
      payload.undo = () => {
        console.log("hello world");

      };
    },
    selectAll(state, payload) {
      for (let [index, element] of payload.view.nodes.entries()) {
        element.isSelected = true;
      }
    },
    clearSelection(state, payload) {
      for (let [index, element] of payload.view.nodes.entries()) {
        element.isSelected = false;
      }
      payload.hello = () => {
        console.log("hello world");
      };
    },
    newName(state, name: String) {
    },
    setPosition(state, payload) {
      for (let [index, element] of payload.view.nodes.entries()) {
        if (element.name === payload.name) {
          element.x = payload.xPos;
          element.y = payload.yPos;
        }
      }
    },
    undoView(state, payload) {
      var found = false;

      if (payload.view.history.length == 0) {
        return;
      }

      while (!found) {



        var lastMutation = payload.view.history.pop();
        if (typeof lastMutation.payload.undo === "function") {
          lastMutation.payload.undo();
          found = true;
        }

        if (payload.view.history.length == 0) {
          found = true;
        }

      }


    },
    moveSelectedOffset(state, payload) {

      if (payload.undoAction) {

        var selectedElement = [] as any;
        var offX = state.dragOffsetX;
        var offY = state.dragOffsetY;

        payload.undo = () => {
          for (let [index, element] of selectedElement.entries()) {
              element.x += offX;
              element.y += offY;
          }
        };


        for (let [index, element] of payload.view.nodes.entries()) {
          if (element.isSelected) {
            selectedElement.push(element);
          }
        }

        for (let [index, element] of payload.view.nodes.entries()) {
          if (element.isSelected) {
            element.x -= state.dragOffsetX;
            element.y -= state.dragOffsetY;
          }
        }
        state.dragOffsetX = 0;
        state.dragOffsetY = 0;
        console.log("undo action added");



      } else {
        state.dragOffsetX = payload.xOff;
        state.dragOffsetY = payload.yOff;

      }
    },
    createTab(state, payload) {
      var i = state.views.length;
      state.views.push(
        {
          history: [] as any,
          type: "workspace",
          key: state.views.length,
          name: "Workspace " + i,
          isActive: false,
          initialZoom: 0.5,
          initialX: 300,
          initialY: 500,
          nodes: [
            {
              key: "315", name: "Welt 3", x: Math.random() * 500,
              y: Math.random() * 500, isSelected: false
            },
            {
              key: "1234", name: "Welt2", x: Math.random() * 500,
              y: Math.random() * 500, isSelected: false
            },
            {
              key: "1347", name: "Welt", x: Math.random() * 500,
              y: Math.random() * 500, isSelected: false
            }]
        }
      );
      state.selectedViewIndex = i;
      state.views.forEach((entry: any, index: Number) => {
        entry.isActive = index === i;
      });
    },
    addNodes(state, payload) {
      for (const node of payload.listNodes) {
        payload.view.nodes.push(node);
      }

    },

  },
  actions: {
    setIsSelected(context, payload) {
      payload.view = context.getters.getView(payload.viewKey);
      context.commit('setIsSelected', payload);
    },
    newName(context, name: String) {
      context.commit('newName', name);
    },
    setPosition(context, payload) {
      payload.view = context.getters.getView(payload.viewKey);
      context.commit('setPosition', payload);
    },
    selectAll(context, payload) {
      payload.view = context.getters.getView(payload.viewKey);
      context.commit('selectAll', payload);
    },
    clearSelection(context, payload) {
      payload.view = context.getters.getView(payload.viewKey);
      context.commit('clearSelection', payload);
    },
    moveSelectedOffset(context, payload) {
      payload.view = context.getters.getView(payload.viewKey);
      context.commit('moveSelectedOffset', payload);
    },
    addNodes(context, payload) {
      let listNodes = [];

      for (let [index, element] of payload.entries.entries()) {
        listNodes.push({
          key: Math.floor(Math.random() * 1000), name: element.name, x: element.x,
          y: element.y, isSelected: false
        });
      }

      payload.listNodes = listNodes;
      payload.view = context.getters.getView(payload.viewKey);
      context.commit('addNodes', payload);
    },
    createTab(context, payload) {
      context.commit('createTab', payload);
    },
    undoView(context, payload) {
      payload.view = context.getters.getView(payload.viewKey);
      context.commit('undoView', payload);
    }

  },
  modules: {
  }
})
