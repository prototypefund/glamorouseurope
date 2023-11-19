import { NavLink, Outlet, useMatch, useResolvedPath } from "react-router-dom";
// @ts-ignore
import { App, Icon, Page, Tabbar, TabbarLink } from "konsta/react";
import {
  MdOutlineDoorFront,
  MdFavoriteBorder,
  MdOutlineCollections,
  MdOutlineAssignmentInd,
} from "react-icons/md";

function Layout() {
  return (
    <App theme="material">
      <Page>
        <Tabbar labels={true} icons={true} className="left-0 bottom-0 fixed">
          <TabbarLink
            active={useMatch({
              path: useResolvedPath("/").pathname,
              end: true,
            })}
            to="/"
            component={NavLink}
            icon={
              <Icon material={<MdOutlineDoorFront className="w-6 h-6" />} />
            }
            label={"Portal"}
          />

          <TabbarLink
            active={useMatch({
              path: useResolvedPath("/selection").pathname,
              end: true,
            })}
            to="/selection"
            component={NavLink}
            icon={<Icon material={<MdFavoriteBorder className="w-6 h-6" />} />}
            label={"Meine Auswahl"}
          />

          <TabbarLink
            active={useMatch({
              path: useResolvedPath("/collection").pathname,
              end: true,
            })}
            to="/collection"
            component={NavLink}
            icon={
              <Icon material={<MdOutlineCollections className="w-6 h-6" />} />
            }
            label={"Meine Sammlung"}
          />

          <TabbarLink
            active={useMatch({
              path: useResolvedPath("/creation").pathname,
              end: true,
            })}
            to="/creation"
            component={NavLink}
            icon={
              <Icon material={<MdOutlineAssignmentInd className="w-6 h-6" />} />
            }
            label={"Meine Leinwand"}
          />
        </Tabbar>
        <main className="h-[calc(100%_-_80px)]">
          <Outlet />
        </main>
      </Page>
    </App>
  );
}

export default Layout;
