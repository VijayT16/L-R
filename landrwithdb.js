const ComponentFunction = function() {
  const React = require('react');
  const { useState, useEffect, useContext, useMemo, useCallback, useRef } = React;
  const { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform, StatusBar, ActivityIndicator, KeyboardAvoidingView, FlatList, Dimensions, Image } = require('react-native');
  const { MaterialIcons, Ionicons, FontAwesome } = require('@expo/vector-icons');
  const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
  const { createStackNavigator } = require('@react-navigation/stack');
  const { useSafeAreaInsets } = require('react-native-safe-area-context');
  const { useQuery, useMutation } = require('platform-hooks');
  const { useCamera } = require('platform-hooks');
  const { useShare } = require('platform-hooks');
  const { useAudio } = require('platform-hooks');

  // ============================================================
  //  DATABASE API CONFIG
  //  Change BASE_URL to your server's IP address & port
  // ============================================================
  const BASE_URL = 'http://YOUR_SERVER_IP:5000/api'; // <-- UPDATE THIS

  let _authToken = null;

  function setAuthToken(token) {
    _authToken = token;
  }

  async function apiRequest(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (_authToken) headers['Authorization'] = 'Bearer ' + _authToken;
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    try {
      const res  = await fetch(BASE_URL + path, options);
      const data = await res.json();
      return data; // always return, let caller check data.success
    } catch (err) {
      return { success: false, message: 'Network error. Check server connection.' };
    }
  }

  // API helper functions — map to every backend route
  const API = {
    // AUTH
    registerBasic:   (d)       => apiRequest('POST', '/auth/register/basic', d),
    verifyOtp:       (id, otp) => apiRequest('POST', '/auth/verify-otp', { userId: id, otp }),
    registerAdvocate:(d)       => apiRequest('POST', '/auth/register/advocate', d),
    login:           (m, p)    => apiRequest('POST', '/auth/login', { mobile: m, password: p }),
    verifyLoginOtp:  async (id, otp) => {
      const data = await apiRequest('POST', '/auth/login/verify-otp', { userId: id, otp });
      if (data.success && data.token) setAuthToken(data.token);
      return data;
    },
    // USERS
    getMyProfile:    ()    => apiRequest('GET',  '/users/me'),
    getAdvocate:     (id)  => apiRequest('GET',  '/users/advocate/' + id),
    getAllAdvocates:  ()    => apiRequest('GET',  '/users/advocates'),
    searchAdvocates: (q)   => apiRequest('GET',  '/users/advocates/search?q=' + encodeURIComponent(q)),
    updateProfile:   (d)   => apiRequest('PUT',  '/users/me', d),
    // CASES
    postCase:        (d)   => apiRequest('POST',  '/cases', d),
    getAllCases:      (f)   => apiRequest('GET',   '/cases' + (f ? '?' + new URLSearchParams(f) : '')),
    getMyCases:      ()    => apiRequest('GET',   '/cases/my'),
    updateCaseStatus:(id, s) => apiRequest('PATCH','/cases/' + id + '/status', { status: s }),
    // POSTS
    createPost:      (d)   => apiRequest('POST', '/posts', d),
    getFeed:         ()    => apiRequest('GET',  '/posts'),
    likePost:        (id)  => apiRequest('POST', '/posts/' + id + '/like'),
  };
  // ============================================================

  const primaryColor   = '#1E3A8A';
  const accentColor    = '#D4AF37';
  const backgroundColor = '#F0F4FF';
  const cardColor      = '#FFFFFF';
  const textPrimary    = '#1E293B';
  const textSecondary  = '#64748B';
  const designStyle    = 'professional';
  const errorColor     = '#DC2626';
  const successColor   = '#059669';
  const W = Dimensions.get('window').width;
  const TAB_MENU_HEIGHT   = Platform.OS === 'web' ? 56 : 49;
  const SCROLL_EXTRA_PADDING = 16;
  const WEB_TAB_MENU_PADDING = 90;
  const HEADER_HEIGHT  = 60;

  const RootStack   = createStackNavigator();
  const AdvocateTab = createBottomTabNavigator();
  const ClientTab   = createBottomTabNavigator();

  // ── AppContext — now backed by real API ──────────────────────
  const AppContext = React.createContext({
    currentUser: null, setCurrentUser: function() {},
    userType: null, setUserType: function() {},
    advocateProfile: null, setAdvocateProfile: function() {},
    posts: [], cases: [], advocates: [],
    loadFeed: function() {}, loadCases: function() {}, loadAdvocates: function() {},
    addPost: function() {}, addCase: function() {},
    pendingUserId: null, setPendingUserId: function() {},
  });

  const AppProvider = function(props) {
    const [currentUser,    setCurrentUser]    = useState(null);
    const [userType,       setUserType]       = useState(null);
    const [advocateProfile,setAdvocateProfile]= useState(null);
    const [posts,          setPosts]          = useState([]);
    const [cases,          setCases]          = useState([]);
    const [advocates,      setAdvocates]      = useState([]);
    const [pendingUserId,  setPendingUserId]  = useState(null); // used during registration

    // Load community feed from database
    const loadFeed = useCallback(async function() {
      const res = await API.getFeed();
      if (res.success) {
        // Map DB fields to the shape the UI expects
        setPosts(res.posts.map(function(p) {
          return {
            id:             p.id,
            advocateId:     p.lnr_id,
            advocateName:   p.advocate_name,
            advocateRating: parseFloat(p.rating) || 0,
            caseType:       p.case_type || 'General',
            title:          p.title,
            description:    p.description,
            image:          p.image_url || 'IMAGE:lawyer-court-justice',
            likes:          p.likes || 0,
            time:           new Date(p.created_at).toLocaleDateString(),
            district:       p.district || '',
          };
        }));
      }
    }, []);

    // Load cases from database
    const loadCases = useCallback(async function(filters) {
      const res = await API.getAllCases(filters);
      if (res.success) {
        setCases(res.cases.map(function(c) {
          return {
            id:          c.id,
            clientName:  c.client_name,
            caseType:    c.case_type,
            description: c.description,
            location:    c.location,
            mobile:      c.mobile,
            whatsapp:    c.whatsapp,
            postedOn:    new Date(c.created_at).toLocaleDateString(),
            status:      c.status,
          };
        }));
      }
    }, []);

    // Load advocates from database
    const loadAdvocates = useCallback(async function() {
      const res = await API.getAllAdvocates();
      if (res.success) {
        setAdvocates(res.advocates.map(function(a) {
          return {
            id:             a.lnrId,
            name:           a.name,
            district:       a.district,
            specialization: a.specialization,
            barCouncil:     a.barCouncil,
            rating:         parseFloat(a.rating) || 0,
            experience:     a.experience || 0,
            degree:         a.degree,
            mobile:         a.mobile,
            whatsapp:       a.whatsapp,
            email:          a.email,
            cases:          a.cases || 0,
            wins:           a.wins  || 0,
            image:          'IMAGE:professional-lawyer-portrait',
          };
        }));
      }
    }, []);

    // Add post via API then refresh feed
    const addPost = useCallback(async function(postData) {
      const res = await API.createPost(postData);
      if (res.success) await loadFeed();
      return res;
    }, [loadFeed]);

    // Add case via API then refresh cases
    const addCase = useCallback(async function(caseData) {
      const res = await API.postCase(caseData);
      if (res.success) await loadCases();
      return res;
    }, [loadCases]);

    const value = useMemo(function() {
      return {
        currentUser, setCurrentUser,
        userType, setUserType,
        advocateProfile, setAdvocateProfile,
        posts, cases, advocates,
        loadFeed, loadCases, loadAdvocates,
        addPost, addCase,
        pendingUserId, setPendingUserId,
      };
    }, [currentUser, userType, advocateProfile, posts, cases, advocates,
        loadFeed, loadCases, loadAdvocates, addPost, addCase, pendingUserId]);

    return React.createElement(AppContext.Provider, { value: value }, props.children);
  };

  const useApp = function() { return useContext(AppContext); };

  const ThemeContext = React.createContext({ theme: { colors: { primary: primaryColor, accent: accentColor, background: backgroundColor, card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary, border: '#CBD5E1', success: successColor, error: errorColor } }, designStyle: designStyle });
  const ThemeProvider = function(props) {
    const theme = useMemo(function() {
      return { colors: { primary: primaryColor, accent: accentColor, background: backgroundColor, card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary, border: '#CBD5E1', success: successColor, error: errorColor } };
    }, []);
    const value = useMemo(function() { return { theme: theme, designStyle: designStyle }; }, [theme]);
    return React.createElement(ThemeContext.Provider, { value: value }, props.children);
  };
  const useTheme = function() { return useContext(ThemeContext); };

  var calculateRating = function(percentage) {
    var p = parseFloat(percentage) || 0;
    if (p >= 90) return (9 + ((p - 90) / 10)).toFixed(1);
    if (p >= 80) return (7 + ((p - 80) / 10) * 2).toFixed(1);
    if (p >= 70) return (5 + ((p - 70) / 10) * 2).toFixed(1);
    if (p >= 60) return (4 + ((p - 60) / 10)).toFixed(1);
    if (p >= 50) return (3 + ((p - 50) / 10)).toFixed(1);
    return (1 + (p / 50) * 2).toFixed(1);
  };

  var renderStars = function(rating, color) {
    var full = Math.floor(rating / 2);
    var stars = [];
    for (var i = 0; i < 5; i++) {
      stars.push(React.createElement(MaterialIcons, { key: 'star' + i, name: i < full ? 'star' : 'star-border', size: 14, color: color || accentColor }));
    }
    return React.createElement(View, { style: { flexDirection: 'row' } }, stars);
  };

  var alertMsg = function(title, msg) {
    Platform.OS === 'web' ? window.alert((title ? title + ': ' : '') + msg) : Alert.alert(title || 'L&R', msg);
  };

  // ── SplashScreen ─────────────────────────────────────────────
  var SplashScreen = function(props) {
    var navigation = props.navigation;
    useEffect(function() {
      var t = setTimeout(function() { navigation.replace('Welcome'); }, 2800);
      return function() { clearTimeout(t); };
    }, []);
    return React.createElement(View, { style: styles.splashContainer },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
      React.createElement(View, { style: styles.splashLogoWrap },
        React.createElement(View, { style: styles.splashLogo },
          React.createElement(Text, { style: styles.splashLogoText }, 'L'),
          React.createElement(Text, { style: styles.splashAmpersand }, '&'),
          React.createElement(Text, { style: styles.splashLogoText }, 'R')
        ),
        React.createElement(View, { style: styles.splashGavelIcon },
          React.createElement(MaterialIcons, { name: 'gavel', size: 40, color: accentColor })
        )
      ),
      React.createElement(Text, { style: styles.splashTagline }, 'LAW & RIGHTS'),
      React.createElement(Text, { style: styles.splashSubtag }, 'Connecting Justice. Empowering Rights.'),
      React.createElement(View, { style: styles.splashDots },
        React.createElement(View, { style: [styles.splashDot, { backgroundColor: accentColor }] }),
        React.createElement(View, { style: [styles.splashDot, { backgroundColor: '#FFFFFF80' }] }),
        React.createElement(View, { style: [styles.splashDot, { backgroundColor: '#FFFFFF50' }] })
      )
    );
  };

  // ── WelcomeScreen ─────────────────────────────────────────────
  var WelcomeScreen = function(props) {
    var navigation = props.navigation;
    var insets = useSafeAreaInsets();
    return React.createElement(View, { style: [styles.welcomeContainer, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }] },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
      React.createElement(View, { style: styles.welcomeTop },
        React.createElement(View, { style: styles.welcomeLogoSmall },
          React.createElement(Text, { style: styles.welcomeLogoTxt }, 'L&R')
        ),
        React.createElement(MaterialIcons, { name: 'balance', size: 60, color: accentColor }),
        React.createElement(Text, { style: styles.welcomeTitle }, 'Welcome to L&R'),
        React.createElement(Text, { style: styles.welcomeSubtitle }, 'Your trusted legal connection platform for advocates and clients across India.')
      ),
      React.createElement(View, { style: styles.welcomeActions },
        React.createElement(TouchableOpacity, { style: styles.btnPrimary, onPress: function() { navigation.navigate('Login'); } },
          React.createElement(MaterialIcons, { name: 'login', size: 20, color: '#FFF' }),
          React.createElement(Text, { style: styles.btnPrimaryText }, 'Log In')
        ),
        React.createElement(TouchableOpacity, { style: styles.btnOutline, onPress: function() { navigation.navigate('SignInBasic'); } },
          React.createElement(MaterialIcons, { name: 'person-add', size: 20, color: primaryColor }),
          React.createElement(Text, { style: styles.btnOutlineText }, 'Sign Up')
        ),
        React.createElement(View, { style: styles.welcomeDivider }),
        React.createElement(Text, { style: styles.welcomeTerms }, 'By continuing, you agree to our Terms of Service and Privacy Policy')
      )
    );
  };

  // ── LoginScreen — uses API.login() ───────────────────────────
  var LoginScreen = function(props) {
    var navigation = props.navigation;
    var insets = useSafeAreaInsets();
    var appCtx = useApp();
    var [mobile, setMobile]   = useState('');
    var [password, setPassword] = useState('');
    var [loading, setLoading] = useState(false);
    var [showPwd, setShowPwd] = useState(false);

    var handleLogin = async function() {
      if (!mobile || !password) { alertMsg('Error', 'Please enter mobile number and password.'); return; }
      setLoading(true);
      var res = await API.login(mobile, password);
      setLoading(false);
      if (!res.success) { alertMsg('Login Failed', res.message); return; }
      // res.userId and res.userType received — go to OTP
      appCtx.setPendingUserId(res.userId);
      navigation.navigate('OTPVerify', { mobile: mobile, fromLogin: true, userId: res.userId, userType: res.userType });
    };

    return React.createElement(KeyboardAvoidingView, { style: { flex: 1, backgroundColor: backgroundColor }, behavior: Platform.OS === 'ios' ? 'padding' : undefined },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
      React.createElement(View, { style: [styles.authHeader, { paddingTop: insets.top + 12 }] },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { padding: 8 } },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFF' })
        ),
        React.createElement(Text, { style: styles.authHeaderTitle }, 'Log In')
      ),
      React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 24, paddingBottom: 40 } },
        React.createElement(View, { style: styles.authLogo },
          React.createElement(Text, { style: styles.authLogoText }, 'L&R')
        ),
        React.createElement(Text, { style: styles.authTitle }, 'Welcome Back'),
        React.createElement(Text, { style: styles.authSubtitle }, 'Log in to your L&R account'),
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Mobile Number'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'phone', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: mobile, onChangeText: function(t) { setMobile(t.replace(/[^0-9+\-() ]/g, '')); }, placeholder: '+91 XXXXXXXXXX', keyboardType: 'phone-pad', placeholderTextColor: '#9CA3AF' })
          )
        ),
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Password'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'lock', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: [styles.textInput, { flex: 1 }], value: password, onChangeText: setPassword, placeholder: 'Enter password', secureTextEntry: !showPwd, autoCapitalize: 'none', placeholderTextColor: '#9CA3AF' }),
            React.createElement(TouchableOpacity, { onPress: function() { setShowPwd(!showPwd); } },
              React.createElement(MaterialIcons, { name: showPwd ? 'visibility-off' : 'visibility', size: 20, color: textSecondary })
            )
          )
        ),
        React.createElement(TouchableOpacity, { style: [styles.btnPrimary, { marginTop: 8 }], onPress: handleLogin, disabled: loading },
          loading ? React.createElement(ActivityIndicator, { color: '#FFF', size: 'small' }) : React.createElement(Text, { style: styles.btnPrimaryText }, 'Send OTP & Login')
        ),
        React.createElement(TouchableOpacity, { style: { alignItems: 'center', marginTop: 20 }, onPress: function() { navigation.navigate('SignInBasic'); } },
          React.createElement(Text, { style: { color: textSecondary, fontSize: 14 } }, "Don't have account? ", React.createElement(Text, { style: { color: primaryColor, fontWeight: 'bold' } }, 'Sign Up'))
        )
      )
    );
  };

  // ── OTPScreen — uses API.verifyOtp() or API.verifyLoginOtp() ─
  var OTPScreen = function(props) {
    var navigation = props.navigation;
    var route      = props.route;
    var insets     = useSafeAreaInsets();
    var appCtx     = useApp();
    var mobile     = route && route.params ? route.params.mobile   : '';
    var fromLogin  = route && route.params ? route.params.fromLogin : false;
    var regData    = route && route.params ? route.params.regData  : null;
    var routeUserId= route && route.params ? route.params.userId   : null;
    var routeUserType = route && route.params ? route.params.userType : null;

    var [otp, setOtp]             = useState(['', '', '', '', '', '']);
    var [loading, setLoading]     = useState(false);
    var [resendTimer, setResendTimer] = useState(30);
    var inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

    useEffect(function() {
      if (resendTimer > 0) {
        var t = setTimeout(function() { setResendTimer(function(p) { return p - 1; }); }, 1000);
        return function() { clearTimeout(t); };
      }
    }, [resendTimer]);

    var handleOtpChange = function(val, idx) {
      val = val.replace(/[^0-9]/g, '');
      var newOtp = otp.slice(); newOtp[idx] = val; setOtp(newOtp);
      if (val && idx < 5 && inputRefs[idx + 1] && inputRefs[idx + 1].current) inputRefs[idx + 1].current.focus();
    };

    var handleVerify = async function() {
      var code = otp.join('');
      if (code.length < 6) { alertMsg('Error', 'Please enter the complete 6-digit OTP.'); return; }
      setLoading(true);

      var userId = routeUserId || appCtx.pendingUserId;

      if (fromLogin) {
        // ── LOGIN OTP: verify and get JWT + user from DB ──────
        var res = await API.verifyLoginOtp(userId, code);
        setLoading(false);
        if (!res.success) { alertMsg('Error', res.message); return; }
        appCtx.setCurrentUser(res.user);
        appCtx.setUserType(res.user.userType);
        if (res.user.userType === 'advocate') {
          appCtx.setAdvocateProfile(res.user);
          navigation.replace('AdvocateApp');
        } else {
          navigation.replace('ClientApp');
        }
      } else {
        // ── REGISTRATION OTP: verify mobile ──────────────────
        var res2 = await API.verifyOtp(userId, code);
        setLoading(false);
        if (!res2.success) { alertMsg('Error', res2.message); return; }
        navigation.navigate('UserType', { regData: regData, userId: userId });
      }
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
      React.createElement(View, { style: [styles.authHeader, { paddingTop: insets.top + 12 }] },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { padding: 8 } },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFF' })
        ),
        React.createElement(Text, { style: styles.authHeaderTitle }, 'OTP Verification')
      ),
      React.createElement(ScrollView, { contentContainerStyle: { padding: 24, alignItems: 'center' } },
        React.createElement(View, { style: { width: 80, height: 80, borderRadius: 40, backgroundColor: primaryColor + '20', alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 20 } },
          React.createElement(MaterialIcons, { name: 'sms', size: 40, color: primaryColor })
        ),
        React.createElement(Text, { style: [styles.authTitle, { textAlign: 'center' }] }, 'Verify OTP'),
        React.createElement(Text, { style: [styles.authSubtitle, { textAlign: 'center', marginBottom: 8 }] }, 'Enter the 6-digit OTP sent to'),
        React.createElement(Text, { style: { color: primaryColor, fontWeight: 'bold', fontSize: 16, marginBottom: 32 } }, mobile),
        React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 } },
          otp.map(function(digit, idx) {
            return React.createElement(TextInput, { key: 'otp' + idx, ref: inputRefs[idx], style: styles.otpBox, value: digit, onChangeText: function(v) { handleOtpChange(v, idx); }, maxLength: 1, keyboardType: 'numeric', textAlign: 'center' });
          })
        ),
        React.createElement(TouchableOpacity, { style: [styles.btnPrimary, { width: '100%' }], onPress: handleVerify, disabled: loading },
          loading ? React.createElement(ActivityIndicator, { color: '#FFF', size: 'small' }) : React.createElement(Text, { style: styles.btnPrimaryText }, 'Verify OTP')
        ),
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 24 } },
          resendTimer > 0
            ? React.createElement(Text, { style: { color: textSecondary } }, 'Resend OTP in ' + resendTimer + 's')
            : React.createElement(TouchableOpacity, { onPress: function() { setResendTimer(30); alertMsg('OTP Sent', 'A new OTP has been sent to ' + mobile); } },
                React.createElement(Text, { style: { color: primaryColor, fontWeight: 'bold' } }, 'Resend OTP')
              )
        )
      )
    );
  };

  // ── SignInBasicScreen — uses API.registerBasic() ─────────────
  var SignInBasicScreen = function(props) {
    var navigation  = props.navigation;
    var insets      = useSafeAreaInsets();
    var appCtx      = useApp();
    var [name, setName]             = useState('');
    var [username, setUsername]     = useState('');
    var [address, setAddress]       = useState('');
    var [countryCode, setCountryCode] = useState('+91');
    var [mobile, setMobile]         = useState('');
    var [email, setEmail]           = useState('');
    var [whatsapp, setWhatsapp]     = useState('');
    var [password, setPassword]     = useState('');
    var [showPwd, setShowPwd]       = useState(false);
    var [loading, setLoading]       = useState(false);

    var handleNext = async function() {
      if (!name.trim() || !username.trim() || !mobile.trim() || !email.trim() || !password.trim()) {
        alertMsg('Error', 'Please fill all required fields including username and password.'); return;
      }
      setLoading(true);
      var res = await API.registerBasic({
        name:     name.trim(),
        username: username.trim(),
        password: password.trim(),
        mobile:   countryCode + mobile.trim(),
        email:    email.trim(),
        whatsapp: countryCode + (whatsapp.trim() || mobile.trim()),
        address:  address.trim(),
      });
      setLoading(false);
      if (!res.success) { alertMsg('Registration Failed', res.message); return; }
      // Save pending userId for OTP screen
      appCtx.setPendingUserId(res.userId);
      navigation.navigate('OTPVerify', {
        mobile:   countryCode + mobile.trim(),
        fromLogin: false,
        userId:   res.userId,
        regData:  { name: name.trim(), mobile: countryCode + mobile.trim(), email: email.trim() },
      });
    };

    return React.createElement(KeyboardAvoidingView, { style: { flex: 1, backgroundColor: backgroundColor }, behavior: Platform.OS === 'ios' ? 'padding' : undefined },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
      React.createElement(View, { style: [styles.authHeader, { paddingTop: insets.top + 12 }] },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { padding: 8 } },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFF' })
        ),
        React.createElement(Text, { style: styles.authHeaderTitle }, 'Create Account')
      ),
      React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 24, paddingBottom: 40 } },
        React.createElement(View, { style: styles.stepIndicator },
          React.createElement(View, { style: [styles.stepDot, { backgroundColor: primaryColor }] }, React.createElement(Text, { style: styles.stepNum }, '1')),
          React.createElement(View, { style: styles.stepLine }),
          React.createElement(View, { style: [styles.stepDot, { backgroundColor: '#CBD5E1' }] }, React.createElement(Text, { style: [styles.stepNum, { color: textSecondary }] }, '2')),
          React.createElement(View, { style: styles.stepLine }),
          React.createElement(View, { style: [styles.stepDot, { backgroundColor: '#CBD5E1' }] }, React.createElement(Text, { style: [styles.stepNum, { color: textSecondary }] }, '3'))
        ),
        React.createElement(Text, { style: styles.authTitle }, 'Basic Details'),
        React.createElement(Text, { style: styles.authSubtitle }, 'Fill in your personal information'),

        // Full Name
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Full Name *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'person', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: name, onChangeText: setName, placeholder: 'Enter your full name', autoCapitalize: 'words', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // Username
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Username *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'alternate-email', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: username, onChangeText: function(t) { setUsername(t.replace(/\s/g, '').toLowerCase()); }, placeholder: 'Choose a username', autoCapitalize: 'none', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // Password
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Password *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'lock', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: [styles.textInput, { flex: 1 }], value: password, onChangeText: setPassword, placeholder: 'Create a strong password', secureTextEntry: !showPwd, autoCapitalize: 'none', placeholderTextColor: '#9CA3AF' }),
            React.createElement(TouchableOpacity, { onPress: function() { setShowPwd(!showPwd); } },
              React.createElement(MaterialIcons, { name: showPwd ? 'visibility-off' : 'visibility', size: 20, color: textSecondary })
            )
          )
        ),
        // Address
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Address'),
          React.createElement(View, { style: [styles.inputRow, { alignItems: 'flex-start', paddingTop: 12 }] },
            React.createElement(MaterialIcons, { name: 'location-on', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: [styles.textInput, { minHeight: 60 }], value: address, onChangeText: setAddress, placeholder: 'Street, City, State', multiline: true, textAlignVertical: 'top', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // Mobile
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Mobile Number *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(TouchableOpacity, { style: styles.countryCode },
              React.createElement(Text, { style: { color: textPrimary, fontWeight: '600', fontSize: 14 } }, countryCode)
            ),
            React.createElement(TextInput, { style: [styles.textInput, { flex: 1 }], value: mobile, onChangeText: function(t) { setMobile(t.replace(/[^0-9]/g, '')); }, placeholder: 'XXXXXXXXXX', keyboardType: 'phone-pad', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // Email
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Email Address *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'email', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: email, onChangeText: setEmail, placeholder: 'you@example.com', keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false, placeholderTextColor: '#9CA3AF' })
          )
        ),
        // WhatsApp
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'WhatsApp Number'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(FontAwesome, { name: 'whatsapp', size: 20, color: '#25D366' }),
            React.createElement(TextInput, { style: [styles.textInput, { flex: 1 }], value: whatsapp, onChangeText: function(t) { setWhatsapp(t.replace(/[^0-9]/g, '')); }, placeholder: 'XXXXXXXXXX (optional)', keyboardType: 'phone-pad', placeholderTextColor: '#9CA3AF' })
          )
        ),
        React.createElement(TouchableOpacity, { style: [styles.btnPrimary, { marginTop: 16 }], onPress: handleNext, disabled: loading },
          loading ? React.createElement(ActivityIndicator, { color: '#FFF', size: 'small' }) :
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 8 } },
              React.createElement(Text, { style: styles.btnPrimaryText }, 'Continue'),
              React.createElement(MaterialIcons, { name: 'arrow-forward', size: 20, color: '#FFF' })
            )
        )
      )
    );
  };

  // ── UserTypeScreen ────────────────────────────────────────────
  var UserTypeScreen = function(props) {
    var navigation = props.navigation;
    var route      = props.route;
    var insets     = useSafeAreaInsets();
    var appCtx     = useApp();
    var regData    = route && route.params ? route.params.regData : {};
    var userId     = route && route.params ? route.params.userId  : appCtx.pendingUserId;
    var [selected, setSelected] = useState(null);

    var handleNext = function() {
      if (!selected) { alertMsg('Error', 'Please select your user type.'); return; }
      if (selected === 'advocate') {
        navigation.navigate('AdvocateDetails', { regData: regData, userId: userId });
      } else {
        // Client is already saved in DB — just log them in
        appCtx.setCurrentUser(Object.assign({}, regData, { userType: 'client' }));
        appCtx.setUserType('client');
        navigation.replace('ClientApp');
      }
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
      React.createElement(View, { style: [styles.authHeader, { paddingTop: insets.top + 12 }] },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { padding: 8 } },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFF' })
        ),
        React.createElement(Text, { style: styles.authHeaderTitle }, 'I Am A...')
      ),
      React.createElement(ScrollView, { contentContainerStyle: { padding: 24 } },
        React.createElement(View, { style: styles.stepIndicator },
          React.createElement(View, { style: [styles.stepDot, { backgroundColor: successColor }] }, React.createElement(MaterialIcons, { name: 'check', size: 14, color: '#FFF' })),
          React.createElement(View, { style: [styles.stepLine, { backgroundColor: successColor }] }),
          React.createElement(View, { style: [styles.stepDot, { backgroundColor: successColor }] }, React.createElement(MaterialIcons, { name: 'check', size: 14, color: '#FFF' })),
          React.createElement(View, { style: [styles.stepLine, { backgroundColor: primaryColor }] }),
          React.createElement(View, { style: [styles.stepDot, { backgroundColor: primaryColor }] }, React.createElement(Text, { style: styles.stepNum }, '3'))
        ),
        React.createElement(Text, { style: [styles.authTitle, { marginTop: 24 }] }, 'Select Your Role'),
        React.createElement(Text, { style: styles.authSubtitle }, 'Choose how you will use L&R'),
        React.createElement(TouchableOpacity, { style: [styles.roleCard, selected === 'client' && styles.roleCardActive], onPress: function() { setSelected('client'); } },
          React.createElement(View, { style: [styles.roleIcon, { backgroundColor: '#EFF6FF' }] },
            React.createElement(MaterialIcons, { name: 'person', size: 40, color: primaryColor })
          ),
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(Text, { style: styles.roleTitle }, 'Client'),
            React.createElement(Text, { style: styles.roleDesc }, 'Seeking legal assistance. Post cases and find qualified advocates.')
          ),
          selected === 'client' && React.createElement(MaterialIcons, { name: 'check-circle', size: 28, color: primaryColor })
        ),
        React.createElement(TouchableOpacity, { style: [styles.roleCard, selected === 'advocate' && styles.roleCardActive, { marginTop: 16 }], onPress: function() { setSelected('advocate'); } },
          React.createElement(View, { style: [styles.roleIcon, { backgroundColor: '#FFF7ED' }] },
            React.createElement(MaterialIcons, { name: 'gavel', size: 40, color: accentColor })
          ),
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(Text, { style: styles.roleTitle }, 'Advocate'),
            React.createElement(Text, { style: styles.roleDesc }, 'Legal professional. Showcase expertise, build profile and connect with clients.')
          ),
          selected === 'advocate' && React.createElement(MaterialIcons, { name: 'check-circle', size: 28, color: primaryColor })
        ),
        React.createElement(TouchableOpacity, { style: [styles.btnPrimary, { marginTop: 32 }], onPress: handleNext },
          React.createElement(Text, { style: styles.btnPrimaryText }, 'Continue'),
          React.createElement(MaterialIcons, { name: 'arrow-forward', size: 20, color: '#FFF' })
        )
      )
    );
  };

  // ── AdvocateDetailsScreen — uses API.registerAdvocate() ──────
  var AdvocateDetailsScreen = function(props) {
    var navigation = props.navigation;
    var route      = props.route;
    var insets     = useSafeAreaInsets();
    var appCtx     = useApp();
    var regData    = route && route.params ? route.params.regData  : {};
    var userId     = route && route.params ? route.params.userId   : appCtx.pendingUserId;

    var [barCouncil, setBarCouncil]       = useState('');
    var [district, setDistrict]           = useState('');
    var [degree, setDegree]               = useState('');
    var [degreePercent, setDegreePercent] = useState('');
    var [specialization, setSpecialization] = useState('');
    var [experience, setExperience]       = useState('');
    var [location, setLocation]           = useState('');
    var [loading, setLoading]             = useState(false);

    var handleSubmit = async function() {
      if (!barCouncil.trim() || !district.trim() || !degree.trim() || !degreePercent.trim()) {
        alertMsg('Error', 'Please fill all required fields.'); return;
      }
      var pct = parseFloat(degreePercent);
      if (isNaN(pct) || pct < 0 || pct > 100) { alertMsg('Error', 'Degree percentage must be 0–100.'); return; }
      setLoading(true);
      var res = await API.registerAdvocate({
        userId:          userId,
        barCouncilNo:    barCouncil.trim(),
        district:        district.trim(),
        degree:          degree.trim(),
        degreePercentage: pct,
        specialization:  specialization.trim() || 'General Law',
        experienceYears: parseInt(experience) || 0,
        location:        location.trim() || district.trim(),
      });
      setLoading(false);
      if (!res.success) { alertMsg('Error', res.message); return; }
      var profile = res.user;
      profile.rating = parseFloat(res.rating);
      appCtx.setCurrentUser(profile);
      appCtx.setUserType('advocate');
      appCtx.setAdvocateProfile(profile);
      navigation.replace('AdvocateRating', { profile: profile, rating: String(res.rating) });
    };

    return React.createElement(KeyboardAvoidingView, { style: { flex: 1, backgroundColor: backgroundColor }, behavior: Platform.OS === 'ios' ? 'padding' : undefined },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
      React.createElement(View, { style: [styles.authHeader, { paddingTop: insets.top + 12 }] },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { padding: 8 } },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFF' })
        ),
        React.createElement(Text, { style: styles.authHeaderTitle }, 'Advocate Profile')
      ),
      React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 24, paddingBottom: 40 } },
        React.createElement(Text, { style: styles.authTitle }, 'Professional Details'),
        React.createElement(Text, { style: styles.authSubtitle }, 'Your credentials are saved securely in our database'),
        // Bar Council
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Bar Council Registration No. *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'account-balance', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: barCouncil, onChangeText: setBarCouncil, placeholder: 'BCI/STATE/YEAR/XXXX', autoCapitalize: 'characters', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // District
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'District / Court *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'location-city', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: district, onChangeText: setDistrict, placeholder: 'District & High Court', autoCapitalize: 'words', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // Degree
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Law Degree *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'school', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: degree, onChangeText: setDegree, placeholder: 'e.g. LLB, LLM, BL', autoCapitalize: 'characters', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // Degree %
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Degree Percentage (%) *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'percent', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: degreePercent, onChangeText: function(t) { var s = t.replace(/[^0-9.]/g, ''); var p = s.split('.'); if (p.length > 2) { s = p[0] + '.' + p.slice(1).join(''); } setDegreePercent(s); }, placeholder: 'e.g. 85.5', keyboardType: 'decimal-pad', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // Specialization
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Specialization'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'work', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: specialization, onChangeText: setSpecialization, placeholder: 'e.g. Criminal, Civil, Family', autoCapitalize: 'words', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // Experience
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Years of Experience'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'history', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: experience, onChangeText: function(t) { setExperience(t.replace(/[^0-9]/g, '')); }, placeholder: 'Years (e.g. 5)', keyboardType: 'numeric', placeholderTextColor: '#9CA3AF' })
          )
        ),
        // Location
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Practice Location'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'location-on', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: location, onChangeText: setLocation, placeholder: 'City, State (e.g. Chennai, Tamil Nadu)', autoCapitalize: 'words', placeholderTextColor: '#9CA3AF' })
          )
        ),
        degreePercent ? React.createElement(View, { style: styles.ratingPreview },
          React.createElement(MaterialIcons, { name: 'stars', size: 24, color: accentColor }),
          React.createElement(Text, { style: { color: textSecondary, fontSize: 13, marginLeft: 8 } }, 'Estimated Rating: '),
          React.createElement(Text, { style: { color: primaryColor, fontWeight: 'bold', fontSize: 16, marginLeft: 4 } }, calculateRating(degreePercent) + ' / 10')
        ) : null,
        React.createElement(TouchableOpacity, { style: [styles.btnPrimary, { marginTop: 20 }], onPress: handleSubmit, disabled: loading },
          loading ? React.createElement(ActivityIndicator, { color: '#FFF', size: 'small' }) : React.createElement(Text, { style: styles.btnPrimaryText }, 'Save to Database & Complete Profile')
        )
      )
    );
  };

  // ── AdvocateRatingScreen ──────────────────────────────────────
  var AdvocateRatingScreen = function(props) {
    var navigation = props.navigation;
    var route      = props.route;
    var insets     = useSafeAreaInsets();
    var profile    = route && route.params ? route.params.profile : {};
    var rating     = route && route.params ? route.params.rating  : '0';

    var getRatingLabel = function(r) {
      var rv = parseFloat(r);
      if (rv >= 9)   return { label: 'Outstanding', color: '#059669' };
      if (rv >= 7.5) return { label: 'Excellent',   color: '#0284C7' };
      if (rv >= 6)   return { label: 'Good',         color: primaryColor };
      if (rv >= 4.5) return { label: 'Average',      color: '#D97706' };
      return { label: 'Developing', color: '#DC2626' };
    };
    var rl = getRatingLabel(rating);

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor, paddingTop: insets.top } },
      React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
      React.createElement(ScrollView, { contentContainerStyle: { padding: 24, alignItems: 'center' } },
        React.createElement(View, { style: styles.celebrationWrap },
          React.createElement(MaterialIcons, { name: 'celebration', size: 60, color: accentColor }),
          React.createElement(Text, { style: styles.celebTitle }, 'Profile Complete!'),
          React.createElement(Text, { style: styles.celebSubtitle }, 'Welcome to L&R, ' + (profile.name || 'Advocate'))
        ),
        React.createElement(View, { style: { backgroundColor: successColor + '15', padding: 12, borderRadius: 10, marginBottom: 16, flexDirection: 'row', alignItems: 'center' } },
          React.createElement(MaterialIcons, { name: 'cloud-done', size: 22, color: successColor }),
          React.createElement(Text, { style: { color: successColor, marginLeft: 8, fontSize: 13, fontWeight: '600' } }, 'All your details saved securely in database')
        ),
        React.createElement(View, { style: styles.ratingCircle },
          React.createElement(Text, { style: styles.ratingBig }, rating),
          React.createElement(Text, { style: styles.ratingOutOf }, '/ 10'),
          React.createElement(View, { style: [styles.ratingLabel, { backgroundColor: rl.color + '20' }] },
            React.createElement(Text, { style: [styles.ratingLabelText, { color: rl.color }] }, rl.label)
          )
        ),
        React.createElement(View, { style: styles.badgeCard },
          React.createElement(MaterialIcons, { name: 'badge', size: 24, color: primaryColor }),
          React.createElement(Text, { style: styles.badgeIdText }, 'Your L&R ID: ' + (profile.lnrId || profile.lnr_id || 'LR------'))
        ),
        React.createElement(TouchableOpacity, { style: [styles.btnPrimary, { width: '100%', marginTop: 32 }], onPress: function() { navigation.replace('AdvocateApp'); } },
          React.createElement(MaterialIcons, { name: 'home', size: 20, color: '#FFF' }),
          React.createElement(Text, { style: styles.btnPrimaryText }, 'Go to Dashboard')
        )
      )
    );
  };

  // ── PostCard ──────────────────────────────────────────────────
  var PostCard = function(props) {
    var post = props.post;
    var onProfilePress = props.onProfilePress;
    var [liked, setLiked]         = useState(false);
    var [likeCount, setLikeCount] = useState(post.likes || 0);

    var handleLike = async function() {
      var newLiked = !liked;
      setLiked(newLiked);
      setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);
      if (newLiked) await API.likePost(post.id); // save to DB
    };

    return React.createElement(View, { style: styles.postCard },
      React.createElement(TouchableOpacity, { style: styles.postHeader, onPress: function() { if (onProfilePress) onProfilePress(post); } },
        React.createElement(View, { style: styles.postAvatar },
          React.createElement(Text, { style: styles.postAvatarText }, (post.advocateName || 'A').charAt(0))
        ),
        React.createElement(View, { style: { flex: 1, marginLeft: 10 } },
          React.createElement(Text, { style: styles.postAdvName }, post.advocateName),
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 2 } },
            React.createElement(Text, { style: { color: accentColor, fontWeight: 'bold', fontSize: 13 } }, '★ ' + post.advocateRating),
            React.createElement(Text, { style: { color: textSecondary, fontSize: 12, marginLeft: 8 } }, post.time)
          )
        ),
        React.createElement(View, { style: [styles.caseTypeBadge, { backgroundColor: primaryColor + '15' }] },
          React.createElement(Text, { style: [styles.caseTypeTxt, { color: primaryColor }] }, post.caseType)
        )
      ),
      React.createElement(Text, { style: styles.postTitle }, post.title),
      React.createElement(Text, { style: styles.postDesc }, post.description),
      post.image && React.createElement(Image, { source: { uri: post.image }, style: styles.postImage, resizeMode: 'cover' }),
      React.createElement(View, { style: styles.postActions },
        React.createElement(TouchableOpacity, { style: styles.postAction, onPress: handleLike },
          React.createElement(MaterialIcons, { name: liked ? 'favorite' : 'favorite-border', size: 20, color: liked ? '#EF4444' : textSecondary }),
          React.createElement(Text, { style: [styles.postActionTxt, liked && { color: '#EF4444' }] }, String(likeCount))
        ),
        React.createElement(TouchableOpacity, { style: styles.postAction },
          React.createElement(MaterialIcons, { name: 'chat-bubble-outline', size: 20, color: textSecondary }),
          React.createElement(Text, { style: styles.postActionTxt }, 'Comment')
        ),
        React.createElement(TouchableOpacity, { style: styles.postAction },
          React.createElement(MaterialIcons, { name: 'share', size: 20, color: textSecondary }),
          React.createElement(Text, { style: styles.postActionTxt }, 'Share')
        )
      )
    );
  };

  // ── AdvocateHomeScreen — loads feed from DB ───────────────────
  var AdvocateHomeScreen = function(props) {
    var navigation = props.navigation;
    var insets     = useSafeAreaInsets();
    var appCtx     = useApp();
    var [loading, setLoading] = useState(false);
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    useEffect(function() {
      setLoading(true);
      appCtx.loadFeed().finally(function() { setLoading(false); });
    }, []);

    var handleProfilePress = function(post) {
      navigation.navigate('AdvocateProfileDetail', { advocate: { id: post.advocateId, name: post.advocateName, rating: post.advocateRating, district: post.district, specialization: post.caseType } });
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.homeHeader, { paddingTop: insets.top + 8 }] },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.homeGreeting }, 'Good Day,'),
          React.createElement(Text, { style: styles.homeUserName }, (appCtx.currentUser && appCtx.currentUser.name) || 'Advocate')
        ),
        React.createElement(View, { style: styles.homeLnrBadge },
          React.createElement(Text, { style: styles.homeLnrText }, (appCtx.currentUser && (appCtx.currentUser.lnrId || appCtx.currentUser.lnr_id)) || 'LR------')
        )
      ),
      loading
        ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
            React.createElement(ActivityIndicator, { size: 'large', color: primaryColor }),
            React.createElement(Text, { style: { color: textSecondary, marginTop: 12 } }, 'Loading from database...')
          )
        : React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingTop: 8, paddingBottom: scrollBottomPadding } },
            React.createElement(View, { style: styles.sectionHeader },
              React.createElement(Text, { style: styles.sectionTitle }, 'Community Feed'),
              React.createElement(MaterialIcons, { name: 'dynamic-feed', size: 20, color: primaryColor })
            ),
            appCtx.posts.length === 0
              ? React.createElement(View, { style: styles.emptyState },
                  React.createElement(MaterialIcons, { name: 'dynamic-feed', size: 60, color: '#CBD5E1' }),
                  React.createElement(Text, { style: styles.emptyText }, 'No posts yet. Be the first to share!')
                )
              : appCtx.posts.map(function(post) {
                  return React.createElement(PostCard, { key: post.id, post: post, onProfilePress: handleProfilePress });
                })
          )
    );
  };

  // ── CasesScreen — loads cases from DB ────────────────────────
  var CasesScreen = function(props) {
    var navigation = props.navigation;
    var insets     = useSafeAreaInsets();
    var appCtx     = useApp();
    var [search, setSearch]   = useState('');
    var [filter, setFilter]   = useState('All');
    var [loading, setLoading] = useState(false);
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);
    var FILTERS = ['All', 'Criminal', 'Civil', 'Family/Divorce', 'Property', 'Labour', 'Consumer'];

    useEffect(function() {
      setLoading(true);
      appCtx.loadCases(filter !== 'All' ? { type: filter } : undefined).finally(function() { setLoading(false); });
    }, [filter]);

    var filtered = appCtx.cases.filter(function(c) {
      return !search || c.clientName.toLowerCase().indexOf(search.toLowerCase()) !== -1 || c.caseType.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.homeHeader, { paddingTop: insets.top + 8 }] },
        React.createElement(Text, { style: styles.homeHeaderTitle }, 'Client Cases'),
        React.createElement(View, { style: styles.casesCount },
          React.createElement(Text, { style: { color: '#FFF', fontWeight: 'bold', fontSize: 13 } }, filtered.length + ' Open')
        )
      ),
      React.createElement(View, { style: { backgroundColor: cardColor, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' } },
        React.createElement(View, { style: styles.searchBar },
          React.createElement(MaterialIcons, { name: 'search', size: 20, color: textSecondary }),
          React.createElement(TextInput, { style: styles.searchInput, value: search, onChangeText: setSearch, placeholder: 'Search cases...', placeholderTextColor: '#9CA3AF' })
        )
      ),
      React.createElement(ScrollView, { horizontal: true, style: { flexGrow: 'initial', backgroundColor: cardColor, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }, showsHorizontalScrollIndicator: false, contentContainerStyle: { paddingHorizontal: 12, paddingBottom: 10, paddingTop: 8 } },
        FILTERS.map(function(f) {
          return React.createElement(TouchableOpacity, { key: f, style: [styles.filterChip, filter === f && styles.filterChipActive], onPress: function() { setFilter(f); } },
            React.createElement(Text, { style: [styles.filterChipTxt, filter === f && styles.filterChipTxtActive] }, f));
        })
      ),
      loading
        ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
            React.createElement(ActivityIndicator, { size: 'large', color: primaryColor }),
            React.createElement(Text, { style: { color: textSecondary, marginTop: 12 } }, 'Fetching cases from database...')
          )
        : React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16, paddingBottom: scrollBottomPadding } },
            filtered.length === 0
              ? React.createElement(View, { style: styles.emptyState },
                  React.createElement(MaterialIcons, { name: 'inbox', size: 60, color: '#CBD5E1' }),
                  React.createElement(Text, { style: styles.emptyText }, 'No cases found')
                )
              : filtered.map(function(c) {
                  return React.createElement(TouchableOpacity, { key: c.id, style: styles.caseCard, onPress: function() { navigation.navigate('CaseDetail', { caseData: c }); } },
                    React.createElement(View, { style: styles.caseCardTop },
                      React.createElement(View, { style: [styles.caseTypePill, { backgroundColor: primaryColor }] },
                        React.createElement(Text, { style: { color: '#FFF', fontSize: 11, fontWeight: 'bold' } }, c.caseType)
                      ),
                      React.createElement(View, { style: [styles.caseStatusPill, { backgroundColor: successColor + '20' }] },
                        React.createElement(Text, { style: { color: successColor, fontSize: 11, fontWeight: '600' } }, c.status)
                      )
                    ),
                    React.createElement(Text, { style: styles.caseClientName }, c.clientName),
                    React.createElement(Text, { style: styles.caseDesc }, c.description.substring(0, 100) + '...'),
                    React.createElement(View, { style: styles.caseCardBottom },
                      React.createElement(MaterialIcons, { name: 'location-on', size: 14, color: textSecondary }),
                      React.createElement(Text, { style: styles.caseLocation }, c.location),
                      React.createElement(MaterialIcons, { name: 'access-time', size: 14, color: textSecondary, style: { marginLeft: 12 } }),
                      React.createElement(Text, { style: styles.caseLocation }, c.postedOn)
                    )
                  );
                })
          )
    );
  };

  // ── CaseDetailScreen ──────────────────────────────────────────
  var CaseDetailScreen = function(props) {
    var navigation = props.navigation;
    var route      = props.route;
    var insets     = useSafeAreaInsets();
    var shareHook  = useShare();
    var share      = shareHook.share;
    var caseData   = route && route.params ? route.params.caseData : { clientName: 'Client', caseType: 'General', description: 'Case description.', location: 'Location', mobile: '+910000000000', whatsapp: '+910000000000', postedOn: 'Today', status: 'Open' };

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.authHeader, { paddingTop: insets.top + 12 }] },
        React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { padding: 8 } },
          React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFF' })
        ),
        React.createElement(Text, { style: styles.authHeaderTitle }, 'Case Details')
      ),
      React.createElement(ScrollView, { contentContainerStyle: { padding: 20, paddingBottom: insets.bottom + 100 } },
        React.createElement(View, { style: styles.caseDetailHeader },
          React.createElement(View, { style: [styles.caseTypePill, { backgroundColor: primaryColor, paddingHorizontal: 14, paddingVertical: 6 }] },
            React.createElement(Text, { style: { color: '#FFF', fontWeight: 'bold' } }, caseData.caseType)
          ),
          React.createElement(View, { style: [styles.caseStatusPill, { backgroundColor: successColor + '20', marginLeft: 8 }] },
            React.createElement(Text, { style: { color: successColor, fontWeight: '600' } }, caseData.status)
          )
        ),
        React.createElement(Text, { style: styles.caseDetailTitle }, 'Case by ' + caseData.clientName),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(MaterialIcons, { name: 'location-on', size: 16, color: primaryColor }),
          React.createElement(Text, { style: styles.infoRowText }, caseData.location)
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(MaterialIcons, { name: 'access-time', size: 16, color: primaryColor }),
          React.createElement(Text, { style: styles.infoRowText }, 'Posted ' + caseData.postedOn)
        ),
        React.createElement(View, { style: styles.detailSection },
          React.createElement(Text, { style: styles.detailSectionTitle }, 'Case Description'),
          React.createElement(Text, { style: styles.detailSectionBody }, caseData.description)
        ),
        React.createElement(View, { style: styles.detailSection },
          React.createElement(Text, { style: styles.detailSectionTitle }, 'Contact Information'),
          React.createElement(View, { style: styles.contactInfoCard },
            React.createElement(View, { style: styles.contactAvatar },
              React.createElement(Text, { style: styles.contactAvatarText }, (caseData.clientName || 'C').charAt(0))
            ),
            React.createElement(View, { style: { flex: 1, marginLeft: 12 } },
              React.createElement(Text, { style: { fontWeight: 'bold', color: textPrimary, fontSize: 16 } }, caseData.clientName),
              React.createElement(Text, { style: { color: textSecondary, fontSize: 13, marginTop: 2 } }, caseData.mobile)
            )
          )
        ),
        React.createElement(View, { style: styles.noticeBox },
          React.createElement(MaterialIcons, { name: 'info-outline', size: 18, color: '#D97706' }),
          React.createElement(Text, { style: styles.noticeText }, 'All communications are subject to the Bar Council Code of Conduct.')
        )
      ),
      React.createElement(View, { style: [styles.caseDetailActions, { paddingBottom: insets.bottom + 16 }] },
        React.createElement(TouchableOpacity, { style: styles.callBtn, onPress: function() { Platform.OS === 'web' ? window.open('tel:' + caseData.mobile) : alertMsg('Call', 'Calling ' + caseData.clientName); } },
          React.createElement(MaterialIcons, { name: 'call', size: 22, color: '#FFF' }),
          React.createElement(Text, { style: styles.callBtnText }, 'Call Client')
        ),
        React.createElement(TouchableOpacity, { style: styles.msgBtn, onPress: function() { Platform.OS === 'web' ? window.open('https://wa.me/' + caseData.whatsapp.replace(/[^0-9]/g, '')) : share({ message: 'Hello, I am an advocate from L&R.' }); } },
          React.createElement(FontAwesome, { name: 'whatsapp', size: 22, color: '#FFF' }),
          React.createElement(Text, { style: styles.callBtnText }, 'WhatsApp')
        )
      )
    );
  };

  // ── AdvocateProfileScreen — loads from DB ────────────────────
  var AdvocateProfileScreen = function(props) {
    var insets  = useSafeAreaInsets();
    var appCtx  = useApp();
    var [user, setUser] = useState(appCtx.currentUser || {});
    var [loading, setLoading] = useState(false);
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    useEffect(function() {
      setLoading(true);
      API.getMyProfile().then(function(res) {
        if (res.success) { setUser(res.user); appCtx.setCurrentUser(res.user); }
      }).finally(function() { setLoading(false); });
    }, []);

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.profileBanner, { paddingTop: insets.top + 8 }] },
        React.createElement(Text, { style: styles.profileBannerTitle }, 'My Profile')
      ),
      loading
        ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
            React.createElement(ActivityIndicator, { size: 'large', color: primaryColor })
          )
        : React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: scrollBottomPadding } },
            React.createElement(View, { style: styles.profileCard },
              React.createElement(View, { style: styles.profileAvatarLarge },
                React.createElement(Text, { style: styles.profileAvatarText }, (user.name || 'A').charAt(0))
              ),
              React.createElement(Text, { style: styles.profileName }, user.name || 'Advocate Name'),
              React.createElement(View, { style: styles.profileLnrRow },
                React.createElement(MaterialIcons, { name: 'badge', size: 16, color: accentColor }),
                React.createElement(Text, { style: styles.profileLnrId }, user.lnrId || user.lnr_id || 'LR------')
              ),
              React.createElement(View, { style: styles.ratingRow },
                renderStars(user.rating || 0),
                React.createElement(Text, { style: styles.ratingVal }, (user.rating || '0') + ' / 10')
              )
            ),
            React.createElement(View, { style: styles.profileInfoBlock },
              React.createElement(Text, { style: styles.profileBlockTitle }, 'Contact Information'),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'phone', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, user.mobile || 'Not provided')),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'email', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, user.email || 'Not provided')),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(FontAwesome, { name: 'whatsapp', size: 18, color: '#25D366' }), React.createElement(Text, { style: styles.profileInfoTxt }, user.whatsapp || 'Not provided')),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'location-on', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, user.address || 'Not provided'))
            ),
            React.createElement(View, { style: styles.profileInfoBlock },
              React.createElement(Text, { style: styles.profileBlockTitle }, 'Professional Details'),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'account-balance', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, 'Bar Council: ' + (user.barCouncil || 'Not provided'))),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'school', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, 'Degree: ' + (user.degree || 'Not provided') + ' (' + (user.degreePercentage || 0) + '%)')),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'location-city', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, 'District: ' + (user.district || 'Not provided'))),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'work', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, 'Specialization: ' + (user.specialization || 'General Law'))),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'history', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, 'Experience: ' + (user.experience || 0) + ' years'))
            )
          )
    );
  };

  // ── PostScreen — saves post to DB ─────────────────────────────
  var PostScreen = function(props) {
    var insets   = useSafeAreaInsets();
    var appCtx   = useApp();
    var cameraHook = useCamera(); var takePhoto = cameraHook.takePhoto; var pickImage = cameraHook.pickImage; var photo = cameraHook.photo;
    var audioHook  = useAudio();  var startRecording = audioHook.startRecording; var stopRecording = audioHook.stopRecording; var isRecording = audioHook.isRecording;
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var [title, setTitle]             = useState('');
    var [description, setDescription] = useState('');
    var [caseType, setCaseType]       = useState('Criminal');
    var [loading, setLoading]         = useState(false);
    var [showTypeMenu, setShowTypeMenu] = useState(false);
    var [audioUri, setAudioUri]       = useState(null);
    var CASE_TYPES = ['Criminal', 'Civil', 'Family/Divorce', 'Property', 'Labour', 'Consumer', 'Corporate', 'Intellectual Property'];

    var handlePost = async function() {
      if (!title.trim() || !description.trim()) { alertMsg('Error', 'Please enter post title and description.'); return; }
      setLoading(true);
      var res = await appCtx.addPost({
        title:       title.trim(),
        description: description.trim(),
        caseType:    caseType,
        imageUrl:    (photo && photo.uri) ? photo.uri : null,
        audioUrl:    audioUri || null,
      });
      setLoading(false);
      if (!res.success) { alertMsg('Error', res.message); return; }
      setTitle(''); setDescription(''); setAudioUri(null);
      alertMsg('Success', 'Your post has been saved to the database and published!');
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.homeHeader, { paddingTop: insets.top + 8 }] },
        React.createElement(Text, { style: styles.homeHeaderTitle }, 'Share Achievement'),
        React.createElement(MaterialIcons, { name: 'campaign', size: 24, color: '#FFF' })
      ),
      React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 20, paddingBottom: scrollBottomPadding } },
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Post Title *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'title', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: title, onChangeText: setTitle, placeholder: 'e.g. Won acquittal in robbery case', autoCapitalize: 'sentences', placeholderTextColor: '#9CA3AF' })
          )
        ),
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Case Type'),
          React.createElement(TouchableOpacity, { style: [styles.inputRow, { justifyContent: 'space-between' }], onPress: function() { setShowTypeMenu(!showTypeMenu); } },
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
              React.createElement(MaterialIcons, { name: 'gavel', size: 20, color: textSecondary }),
              React.createElement(Text, { style: [styles.textInput, { color: textPrimary }] }, caseType)
            ),
            React.createElement(MaterialIcons, { name: showTypeMenu ? 'keyboard-arrow-up' : 'keyboard-arrow-down', size: 24, color: textSecondary })
          ),
          showTypeMenu && React.createElement(View, { style: styles.dropdown },
            CASE_TYPES.map(function(ct) {
              return React.createElement(TouchableOpacity, { key: ct, style: styles.dropdownItem, onPress: function() { setCaseType(ct); setShowTypeMenu(false); } },
                React.createElement(Text, { style: [styles.dropdownText, ct === caseType && { color: primaryColor, fontWeight: 'bold' }] }, ct));
            })
          )
        ),
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Case Description *'),
          React.createElement(View, { style: [styles.inputRow, { alignItems: 'flex-start', paddingTop: 12 }] },
            React.createElement(MaterialIcons, { name: 'description', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: [styles.textInput, { minHeight: 100 }], value: description, onChangeText: setDescription, placeholder: 'Describe the case achievement...', multiline: true, textAlignVertical: 'top', placeholderTextColor: '#9CA3AF' })
          )
        ),
        React.createElement(View, { style: styles.mediaButtons },
          React.createElement(TouchableOpacity, { style: styles.mediaBtn, onPress: function() { takePhoto(); } },
            React.createElement(MaterialIcons, { name: 'camera-alt', size: 22, color: primaryColor }),
            React.createElement(Text, { style: styles.mediaBtnText }, 'Camera')
          ),
          React.createElement(TouchableOpacity, { style: styles.mediaBtn, onPress: function() { pickImage({ allowsEditing: true }); } },
            React.createElement(MaterialIcons, { name: 'photo-library', size: 22, color: primaryColor }),
            React.createElement(Text, { style: styles.mediaBtnText }, 'Gallery')
          ),
          React.createElement(TouchableOpacity, { style: [styles.mediaBtn, isRecording && { backgroundColor: '#FEF2F2', borderColor: errorColor }],
            onPress: function() {
              if (isRecording) { stopRecording().then(function(r) { if (r.uri) setAudioUri(r.uri); }); }
              else { startRecording(); }
            }},
            React.createElement(MaterialIcons, { name: isRecording ? 'stop' : 'mic', size: 22, color: isRecording ? errorColor : primaryColor }),
            React.createElement(Text, { style: [styles.mediaBtnText, isRecording && { color: errorColor }] }, isRecording ? 'Stop' : 'Record')
          )
        ),
        photo && React.createElement(Image, { source: { uri: photo.uri }, style: { width: '100%', height: 200, borderRadius: 12, marginTop: 12 }, resizeMode: 'cover' }),
        audioUri && React.createElement(View, { style: styles.audioPreview },
          React.createElement(MaterialIcons, { name: 'audiotrack', size: 20, color: successColor }),
          React.createElement(Text, { style: { color: successColor, marginLeft: 8, fontSize: 13 } }, 'Audio recorded')
        ),
        React.createElement(TouchableOpacity, { style: [styles.btnPrimary, { marginTop: 24 }], onPress: handlePost, disabled: loading },
          loading ? React.createElement(ActivityIndicator, { color: '#FFF', size: 'small' }) :
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
              React.createElement(MaterialIcons, { name: 'cloud-upload', size: 20, color: '#FFF' }),
              React.createElement(Text, { style: [styles.btnPrimaryText, { marginLeft: 8 }] }, 'Save & Publish Post')
            )
        )
      )
    );
  };

  // ── AdvocateTabNavigator ──────────────────────────────────────
  var AdvocateTabNavigator = function() {
    var insets = useSafeAreaInsets();
    return React.createElement(View, { style: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' } },
      React.createElement(AdvocateTab.Navigator, {
        screenOptions: { headerShown: false, tabBarStyle: { position: 'absolute', bottom: 0, height: Platform.OS === 'web' ? TAB_MENU_HEIGHT : TAB_MENU_HEIGHT + insets.bottom, borderTopWidth: 0, backgroundColor: primaryColor, elevation: 10 }, tabBarActiveTintColor: accentColor, tabBarInactiveTintColor: '#FFFFFF80', tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }
      },
        React.createElement(AdvocateTab.Screen, { name: 'AdvHome',   component: AdvocateHomeScreen,   options: { tabBarLabel: 'Home',       tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'home',        size: 24, color: p.color }); } } }),
        React.createElement(AdvocateTab.Screen, { name: 'Cases',     component: CasesScreen,          options: { tabBarLabel: 'Cases',      tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'folder-open', size: 24, color: p.color }); } } }),
        React.createElement(AdvocateTab.Screen, { name: 'AdvProfile',component: AdvocateProfileScreen,options: { tabBarLabel: 'My Profile', tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'person',      size: 24, color: p.color }); } } }),
        React.createElement(AdvocateTab.Screen, { name: 'Post',      component: PostScreen,           options: { tabBarLabel: 'Post',       tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'add-box',     size: 24, color: p.color }); } } })
      )
    );
  };

  // ── ClientHomeScreen — loads feed from DB ─────────────────────
  var ClientHomeScreen = function(props) {
    var navigation = props.navigation;
    var insets     = useSafeAreaInsets();
    var appCtx     = useApp();
    var [loading, setLoading] = useState(false);
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    useEffect(function() {
      setLoading(true);
      appCtx.loadFeed().finally(function() { setLoading(false); });
    }, []);

    var handleProfilePress = function(post) {
      var found = appCtx.advocates.find(function(a) { return a.id === post.advocateId; });
      navigation.navigate('AdvocateProfileDetail', { advocate: found || { id: post.advocateId, name: post.advocateName, rating: post.advocateRating, district: post.district, specialization: post.caseType } });
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.homeHeader, { paddingTop: insets.top + 8 }] },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.homeGreeting }, 'Welcome,'),
          React.createElement(Text, { style: styles.homeUserName }, (appCtx.currentUser && appCtx.currentUser.name) || 'Client')
        ),
        React.createElement(View, { style: styles.homeLnrBadge },
          React.createElement(Text, { style: styles.homeLnrText }, (appCtx.currentUser && (appCtx.currentUser.lnrId || appCtx.currentUser.lnr_id)) || 'LR------')
        )
      ),
      loading
        ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
            React.createElement(ActivityIndicator, { size: 'large', color: primaryColor }),
            React.createElement(Text, { style: { color: textSecondary, marginTop: 12 } }, 'Loading feed from database...')
          )
        : React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingTop: 8, paddingBottom: scrollBottomPadding } },
            React.createElement(View, { style: styles.sectionHeader },
              React.createElement(Text, { style: styles.sectionTitle }, 'Advocate Achievements'),
              React.createElement(MaterialIcons, { name: 'verified', size: 20, color: primaryColor })
            ),
            appCtx.posts.length === 0
              ? React.createElement(View, { style: styles.emptyState },
                  React.createElement(MaterialIcons, { name: 'dynamic-feed', size: 60, color: '#CBD5E1' }),
                  React.createElement(Text, { style: styles.emptyText }, 'No posts yet.')
                )
              : appCtx.posts.map(function(post) {
                  return React.createElement(PostCard, { key: post.id, post: post, onProfilePress: handleProfilePress });
                })
          )
    );
  };

  // ── AdvocatesScreen — loads from DB ──────────────────────────
  var AdvocatesScreen = function(props) {
    var navigation = props.navigation;
    var insets     = useSafeAreaInsets();
    var appCtx     = useApp();
    var [loading, setLoading] = useState(false);
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    useEffect(function() {
      setLoading(true);
      appCtx.loadAdvocates().finally(function() { setLoading(false); });
    }, []);

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.homeHeader, { paddingTop: insets.top + 8 }] },
        React.createElement(Text, { style: styles.homeHeaderTitle }, 'Top Advocates'),
        React.createElement(MaterialIcons, { name: 'gavel', size: 24, color: '#FFF' })
      ),
      loading
        ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
            React.createElement(ActivityIndicator, { size: 'large', color: primaryColor }),
            React.createElement(Text, { style: { color: textSecondary, marginTop: 12 } }, 'Loading advocates from database...')
          )
        : React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16, paddingBottom: scrollBottomPadding } },
            appCtx.advocates.sort(function(a, b) { return b.rating - a.rating; }).map(function(adv) {
              return React.createElement(TouchableOpacity, { key: adv.id, style: styles.advCard, onPress: function() { navigation.navigate('AdvocateProfileDetail', { advocate: adv }); } },
                React.createElement(View, { style: [styles.advAvatarLg, { backgroundColor: primaryColor }] },
                  React.createElement(Text, { style: styles.advAvatarLgText }, adv.name.charAt(0))
                ),
                React.createElement(View, { style: { flex: 1, marginLeft: 12 } },
                  React.createElement(Text, { style: styles.advName }, adv.name),
                  React.createElement(Text, { style: styles.advSpec }, adv.specialization),
                  React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 4 } },
                    renderStars(adv.rating),
                    React.createElement(Text, { style: { color: accentColor, fontWeight: 'bold', fontSize: 13, marginLeft: 6 } }, adv.rating)
                  ),
                  React.createElement(View, { style: { flexDirection: 'row', marginTop: 4 } },
                    React.createElement(MaterialIcons, { name: 'location-city', size: 13, color: textSecondary }),
                    React.createElement(Text, { style: { color: textSecondary, fontSize: 12, marginLeft: 3 } }, adv.district),
                    React.createElement(Text, { style: { color: textSecondary, fontSize: 12, marginLeft: 12 } }, adv.experience + ' yrs exp.')
                  )
                ),
                React.createElement(MaterialIcons, { name: 'chevron-right', size: 24, color: '#CBD5E1' })
              );
            })
          )
    );
  };

  // ── SearchScreen — uses API.searchAdvocates() ─────────────────
  var SearchScreen = function(props) {
    var navigation = props.navigation;
    var insets     = useSafeAreaInsets();
    var [searchId, setSearchId]   = useState('');
    var [results, setResults]     = useState([]);
    var [searched, setSearched]   = useState(false);
    var [loading, setLoading]     = useState(false);
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var handleSearch = async function() {
      if (!searchId.trim()) { alertMsg('Error', 'Please enter an L&R ID or name to search.'); return; }
      setLoading(true);
      var res = await API.searchAdvocates(searchId.trim());
      setLoading(false);
      setSearched(true);
      if (res.success) setResults(res.results);
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.homeHeader, { paddingTop: insets.top + 8 }] },
        React.createElement(Text, { style: styles.homeHeaderTitle }, 'Find Advocate'),
        React.createElement(MaterialIcons, { name: 'manage-search', size: 24, color: '#FFF' })
      ),
      React.createElement(View, { style: { backgroundColor: cardColor, padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' } },
        React.createElement(Text, { style: { color: textSecondary, fontSize: 13, marginBottom: 10 } }, 'Search by L&R ID or advocate name in the database'),
        React.createElement(View, { style: styles.searchBarLarge },
          React.createElement(MaterialIcons, { name: 'badge', size: 22, color: primaryColor }),
          React.createElement(TextInput, { style: [styles.searchInput, { flex: 1 }], value: searchId, onChangeText: setSearchId, placeholder: 'LR ID or Name', placeholderTextColor: '#9CA3AF', autoCapitalize: 'characters', onSubmitEditing: handleSearch }),
          React.createElement(TouchableOpacity, { style: styles.searchBtn, onPress: handleSearch },
            React.createElement(MaterialIcons, { name: 'search', size: 22, color: '#FFF' })
          )
        )
      ),
      loading
        ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
            React.createElement(ActivityIndicator, { size: 'large', color: primaryColor }),
            React.createElement(Text, { style: { color: textSecondary, marginTop: 12 } }, 'Searching database...')
          )
        : React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 16, paddingBottom: scrollBottomPadding } },
            !searched
              ? React.createElement(View, { style: { alignItems: 'center', paddingTop: 60 } },
                  React.createElement(MaterialIcons, { name: 'person-search', size: 80, color: '#CBD5E1' }),
                  React.createElement(Text, { style: { color: textSecondary, fontSize: 16, marginTop: 12, textAlign: 'center' } }, 'Search by L&R ID or name to find verified advocates from the database.')
                )
              : results.length === 0
                ? React.createElement(View, { style: styles.emptyState },
                    React.createElement(MaterialIcons, { name: 'search-off', size: 60, color: '#CBD5E1' }),
                    React.createElement(Text, { style: styles.emptyText }, 'No advocates found for "' + searchId + '"')
                  )
                : results.map(function(adv) {
                    return React.createElement(TouchableOpacity, { key: adv.id || adv.lnr_id, style: styles.advCard, onPress: function() { navigation.navigate('AdvocateProfileDetail', { advocate: adv }); } },
                      React.createElement(View, { style: [styles.advAvatarLg, { backgroundColor: accentColor }] },
                        React.createElement(Text, { style: styles.advAvatarLgText }, adv.name.charAt(0))
                      ),
                      React.createElement(View, { style: { flex: 1, marginLeft: 12 } },
                        React.createElement(Text, { style: styles.advName }, adv.name),
                        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 2 } },
                          React.createElement(MaterialIcons, { name: 'badge', size: 13, color: primaryColor }),
                          React.createElement(Text, { style: { color: primaryColor, fontWeight: 'bold', fontSize: 13, marginLeft: 3 } }, adv.lnrId || adv.lnr_id)
                        ),
                        React.createElement(Text, { style: styles.advSpec }, (adv.specialization || '') + ' • ' + (adv.district || '')),
                        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 4 } },
                          renderStars(adv.rating || 0),
                          React.createElement(Text, { style: { color: accentColor, fontWeight: 'bold', fontSize: 13, marginLeft: 6 } }, adv.rating || 0)
                        )
                      ),
                      React.createElement(MaterialIcons, { name: 'chevron-right', size: 24, color: '#CBD5E1' })
                    );
                  })
          )
    );
  };

  // ── AddCasesScreen — saves case to DB ────────────────────────
  var AddCasesScreen = function(props) {
    var insets  = useSafeAreaInsets();
    var appCtx  = useApp();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    var [description, setDescription]           = useState('');
    var [caseType, setCaseType]                 = useState('Criminal');
    var [location, setLocation]                 = useState('');
    var [preferredAdvocate, setPreferredAdvocate] = useState('');
    var [loading, setLoading]                   = useState(false);
    var [showTypeMenu, setShowTypeMenu]         = useState(false);
    var CASE_TYPES = ['Criminal', 'Civil', 'Family/Divorce', 'Property', 'Labour', 'Consumer', 'Corporate', 'Matrimonial', 'Other'];

    var handleSubmit = async function() {
      if (!description.trim() || !location.trim()) { alertMsg('Error', 'Please provide case description and location.'); return; }
      setLoading(true);
      var res = await appCtx.addCase({
        caseType:           caseType,
        description:        description.trim(),
        location:           location.trim(),
        preferredAdvocate:  preferredAdvocate.trim() || undefined,
      });
      setLoading(false);
      if (!res.success) { alertMsg('Error', res.message); return; }
      setDescription(''); setLocation(''); setPreferredAdvocate('');
      alertMsg('Success', 'Your case has been saved to the database. Advocates will contact you soon!');
    };

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.homeHeader, { paddingTop: insets.top + 8 }] },
        React.createElement(Text, { style: styles.homeHeaderTitle }, 'Register Case'),
        React.createElement(MaterialIcons, { name: 'folder-special', size: 24, color: '#FFF' })
      ),
      React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { padding: 20, paddingBottom: scrollBottomPadding } },
        React.createElement(View, { style: styles.noticeBox },
          React.createElement(MaterialIcons, { name: 'info-outline', size: 18, color: '#D97706' }),
          React.createElement(Text, { style: styles.noticeText }, 'Your case is stored securely in our encrypted database. Only verified advocates can view it.')
        ),
        React.createElement(View, { style: [styles.inputGroup, { marginTop: 16 }] },
          React.createElement(Text, { style: styles.inputLabel }, 'Type of Case *'),
          React.createElement(TouchableOpacity, { style: [styles.inputRow, { justifyContent: 'space-between' }], onPress: function() { setShowTypeMenu(!showTypeMenu); } },
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
              React.createElement(MaterialIcons, { name: 'gavel', size: 20, color: textSecondary }),
              React.createElement(Text, { style: [styles.textInput, { color: textPrimary }] }, caseType)
            ),
            React.createElement(MaterialIcons, { name: showTypeMenu ? 'keyboard-arrow-up' : 'keyboard-arrow-down', size: 24, color: textSecondary })
          ),
          showTypeMenu && React.createElement(View, { style: styles.dropdown },
            CASE_TYPES.map(function(ct) {
              return React.createElement(TouchableOpacity, { key: ct, style: styles.dropdownItem, onPress: function() { setCaseType(ct); setShowTypeMenu(false); } },
                React.createElement(Text, { style: [styles.dropdownText, ct === caseType && { color: primaryColor, fontWeight: 'bold' }] }, ct));
            })
          )
        ),
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Case Description *'),
          React.createElement(View, { style: [styles.inputRow, { alignItems: 'flex-start', paddingTop: 12 }] },
            React.createElement(MaterialIcons, { name: 'description', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: [styles.textInput, { minHeight: 120 }], value: description, onChangeText: setDescription, placeholder: 'Describe your legal issue in detail...', multiline: true, textAlignVertical: 'top', placeholderTextColor: '#9CA3AF' })
          )
        ),
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Location / Jurisdiction *'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'location-on', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: location, onChangeText: setLocation, placeholder: 'City, District, State', autoCapitalize: 'words', placeholderTextColor: '#9CA3AF' })
          )
        ),
        React.createElement(View, { style: styles.inputGroup },
          React.createElement(Text, { style: styles.inputLabel }, 'Preferred Advocate (optional)'),
          React.createElement(View, { style: styles.inputRow },
            React.createElement(MaterialIcons, { name: 'badge', size: 20, color: textSecondary }),
            React.createElement(TextInput, { style: styles.textInput, value: preferredAdvocate, onChangeText: setPreferredAdvocate, placeholder: 'L&R ID of preferred advocate', autoCapitalize: 'characters', placeholderTextColor: '#9CA3AF' })
          )
        ),
        React.createElement(TouchableOpacity, { style: [styles.btnPrimary, { marginTop: 20 }], onPress: handleSubmit, disabled: loading },
          loading ? React.createElement(ActivityIndicator, { color: '#FFF', size: 'small' }) :
            React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center' } },
              React.createElement(MaterialIcons, { name: 'cloud-upload', size: 20, color: '#FFF' }),
              React.createElement(Text, { style: [styles.btnPrimaryText, { marginLeft: 8 }] }, 'Save Case to Database')
            )
        )
      )
    );
  };

  // ── ClientProfileScreen — loads from DB ──────────────────────
  var ClientProfileScreen = function(props) {
    var insets  = useSafeAreaInsets();
    var appCtx  = useApp();
    var [user, setUser]       = useState(appCtx.currentUser || {});
    var [myCases, setMyCases] = useState([]);
    var [loading, setLoading] = useState(false);
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);

    useEffect(function() {
      setLoading(true);
      Promise.all([API.getMyProfile(), API.getMyCases()]).then(function(results) {
        if (results[0].success) { setUser(results[0].user); appCtx.setCurrentUser(results[0].user); }
        if (results[1].success) setMyCases(results[1].cases);
      }).finally(function() { setLoading(false); });
    }, []);

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.profileBanner, { paddingTop: insets.top + 8 }] },
        React.createElement(Text, { style: styles.profileBannerTitle }, 'My Profile')
      ),
      loading
        ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
            React.createElement(ActivityIndicator, { size: 'large', color: primaryColor })
          )
        : React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: scrollBottomPadding } },
            React.createElement(View, { style: styles.profileCard },
              React.createElement(View, { style: [styles.profileAvatarLarge, { backgroundColor: '#059669' }] },
                React.createElement(Text, { style: styles.profileAvatarText }, (user.name || 'C').charAt(0))
              ),
              React.createElement(Text, { style: styles.profileName }, user.name || 'Client Name'),
              React.createElement(View, { style: styles.profileLnrRow },
                React.createElement(MaterialIcons, { name: 'badge', size: 16, color: accentColor }),
                React.createElement(Text, { style: styles.profileLnrId }, user.lnrId || user.lnr_id || 'LR------')
              )
            ),
            React.createElement(View, { style: styles.profileInfoBlock },
              React.createElement(Text, { style: styles.profileBlockTitle }, 'Contact Information'),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'phone',    size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, user.mobile   || 'Not provided')),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'email',    size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, user.email    || 'Not provided')),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(FontAwesome,   { name: 'whatsapp', size: 18, color: '#25D366'   }), React.createElement(Text, { style: styles.profileInfoTxt }, user.whatsapp || 'Not provided')),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'location-on', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, user.address || 'Not provided'))
            ),
            React.createElement(View, { style: styles.profileInfoBlock },
              React.createElement(Text, { style: styles.profileBlockTitle }, 'My Cases (' + myCases.length + ') — from Database'),
              myCases.length === 0
                ? React.createElement(Text, { style: { color: textSecondary, textAlign: 'center', padding: 16, fontSize: 14 } }, 'No cases registered yet. Go to Add Cases to register your first case.')
                : myCases.map(function(c) {
                    return React.createElement(View, { key: c.id, style: styles.myCaseItem },
                      React.createElement(View, { style: [styles.caseTypePill, { backgroundColor: primaryColor }] },
                        React.createElement(Text, { style: { color: '#FFF', fontSize: 11, fontWeight: 'bold' } }, c.case_type || c.caseType)
                      ),
                      React.createElement(Text, { style: { color: textPrimary, fontSize: 14, marginTop: 6, marginBottom: 4 } }, (c.description || '').substring(0, 80) + '...'),
                      React.createElement(Text, { style: { color: textSecondary, fontSize: 12 } }, (c.created_at ? new Date(c.created_at).toLocaleDateString() : c.postedOn) + ' • ' + (c.status || 'Open'))
                    );
                  })
            )
          )
    );
  };

  // ── AdvocateProfileDetailScreen — loads from DB by LNR ID ────
  var AdvocateProfileDetailScreen = function(props) {
    var navigation = props.navigation;
    var route      = props.route;
    var insets     = useSafeAreaInsets();
    var shareHook  = useShare(); var share = shareHook.share;
    var advocate   = route && route.params ? route.params.advocate : null;
    var [adv, setAdv]   = useState(advocate || {});
    var [loading, setLoading] = useState(false);

    useEffect(function() {
      if (advocate && (advocate.id || advocate.lnrId)) {
        var lnrId = advocate.id || advocate.lnrId;
        setLoading(true);
        API.getAdvocate(lnrId).then(function(res) {
          if (res.success) setAdv(res.advocate);
        }).finally(function() { setLoading(false); });
      }
    }, []);

    return React.createElement(View, { style: { flex: 1, backgroundColor: backgroundColor } },
      React.createElement(View, { style: [styles.advDetailBanner, { paddingTop: insets.top }] },
        React.createElement(View, { style: styles.advDetailBannerRow },
          React.createElement(TouchableOpacity, { onPress: function() { navigation.goBack(); }, style: { padding: 8 } },
            React.createElement(MaterialIcons, { name: 'arrow-back', size: 24, color: '#FFF' })
          ),
          React.createElement(Text, { style: { color: '#FFF', fontWeight: 'bold', fontSize: 17, flex: 1, textAlign: 'center' } }, 'Advocate Profile'),
          React.createElement(TouchableOpacity, { onPress: function() { share({ message: 'Check out ' + adv.name + ' (' + (adv.lnrId || adv.id) + ') on L&R' }); }, style: { padding: 8 } },
            React.createElement(MaterialIcons, { name: 'share', size: 24, color: '#FFF' })
          )
        ),
        React.createElement(View, { style: styles.advDetailProfile },
          React.createElement(View, { style: styles.advDetailAvatar },
            React.createElement(Text, { style: styles.advDetailAvatarText }, (adv.name || 'A').charAt(0))
          ),
          React.createElement(Text, { style: styles.advDetailName }, adv.name || 'Loading...'),
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 4 } },
            React.createElement(MaterialIcons, { name: 'badge', size: 14, color: accentColor }),
            React.createElement(Text, { style: { color: '#FFFFFFCC', fontSize: 13, marginLeft: 4 } }, adv.lnrId || adv.id || '')
          ),
          React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 8 } },
            renderStars(adv.rating || 0, '#FFF'),
            React.createElement(Text, { style: { color: accentColor, fontWeight: 'bold', fontSize: 16, marginLeft: 8 } }, (adv.rating || 0) + ' / 10')
          )
        )
      ),
      loading
        ? React.createElement(View, { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
            React.createElement(ActivityIndicator, { size: 'large', color: primaryColor })
          )
        : React.createElement(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: insets.bottom + 100 } },
            React.createElement(View, { style: styles.statsRow },
              React.createElement(View, { style: styles.statItem }, React.createElement(Text, { style: styles.statNum }, String(adv.cases || 0)),  React.createElement(Text, { style: styles.statLbl }, 'Cases')),
              React.createElement(View, { style: styles.statDivider }),
              React.createElement(View, { style: styles.statItem }, React.createElement(Text, { style: styles.statNum }, String(adv.wins  || 0)),  React.createElement(Text, { style: styles.statLbl }, 'Wins')),
              React.createElement(View, { style: styles.statDivider }),
              React.createElement(View, { style: styles.statItem }, React.createElement(Text, { style: styles.statNum }, String(adv.experience || 0) + 'yr'), React.createElement(Text, { style: styles.statLbl }, 'Experience'))
            ),
            React.createElement(View, { style: styles.profileInfoBlock },
              React.createElement(Text, { style: styles.profileBlockTitle }, 'Professional Details'),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'account-balance', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, 'Bar Council: ' + (adv.barCouncil || 'Verified'))),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'school',           size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, 'Degree: ' + (adv.degree || 'LLB'))),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'location-city',    size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, 'District: ' + (adv.district || 'Not specified'))),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'work',             size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, 'Specialization: ' + (adv.specialization || 'General Law')))
            ),
            React.createElement(View, { style: styles.profileInfoBlock },
              React.createElement(Text, { style: styles.profileBlockTitle }, 'Contact'),
              React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'phone', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, adv.mobile || 'Not provided')),
              adv.email && React.createElement(View, { style: styles.profileInfoRow }, React.createElement(MaterialIcons, { name: 'email', size: 18, color: primaryColor }), React.createElement(Text, { style: styles.profileInfoTxt }, adv.email))
            )
          ),
      React.createElement(View, { style: [styles.caseDetailActions, { paddingBottom: insets.bottom + 16 }] },
        React.createElement(TouchableOpacity, { style: styles.callBtn, onPress: function() { Platform.OS === 'web' ? window.open('tel:' + adv.mobile) : alertMsg('Call', 'Calling ' + adv.name); } },
          React.createElement(MaterialIcons, { name: 'call', size: 22, color: '#FFF' }),
          React.createElement(Text, { style: styles.callBtnText }, 'Call Now')
        ),
        React.createElement(TouchableOpacity, { style: styles.msgBtn, onPress: function() { Platform.OS === 'web' ? window.open('https://wa.me/' + (adv.whatsapp || '').replace(/[^0-9]/g, '')) : share({ message: 'Hello ' + adv.name + ', I found your profile on L&R.' }); } },
          React.createElement(FontAwesome, { name: 'whatsapp', size: 22, color: '#FFF' }),
          React.createElement(Text, { style: styles.callBtnText }, 'WhatsApp')
        )
      )
    );
  };

  // ── ClientTabNavigator ────────────────────────────────────────
  var ClientTabNavigator = function() {
    var insets = useSafeAreaInsets();
    return React.createElement(View, { style: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' } },
      React.createElement(ClientTab.Navigator, {
        screenOptions: { headerShown: false, tabBarStyle: { position: 'absolute', bottom: 0, height: Platform.OS === 'web' ? TAB_MENU_HEIGHT : TAB_MENU_HEIGHT + insets.bottom, borderTopWidth: 0, backgroundColor: primaryColor, elevation: 10 }, tabBarActiveTintColor: accentColor, tabBarInactiveTintColor: '#FFFFFF80', tabBarLabelStyle: { fontSize: 10, fontWeight: '600' } }
      },
        React.createElement(ClientTab.Screen, { name: 'ClientHome',   component: ClientHomeScreen,   options: { tabBarLabel: 'Home',      tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'home',                size: 24, color: p.color }); } } }),
        React.createElement(ClientTab.Screen, { name: 'Advocates',    component: AdvocatesScreen,    options: { tabBarLabel: 'Advocates', tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'gavel',               size: 24, color: p.color }); } } }),
        React.createElement(ClientTab.Screen, { name: 'Search',       component: SearchScreen,       options: { tabBarLabel: 'Search',    tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'search',              size: 24, color: p.color }); } } }),
        React.createElement(ClientTab.Screen, { name: 'AddCases',     component: AddCasesScreen,     options: { tabBarLabel: 'Add Case',  tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'add-circle-outline', size: 24, color: p.color }); } } }),
        React.createElement(ClientTab.Screen, { name: 'ClientProfile',component: ClientProfileScreen,options: { tabBarLabel: 'Profile',   tabBarIcon: function(p) { return React.createElement(MaterialIcons, { name: 'person',              size: 24, color: p.color }); } } })
      )
    );
  };

  // ── Styles ────────────────────────────────────────────────────
  const styles = StyleSheet.create({
    splashContainer: { flex: 1, backgroundColor: primaryColor, alignItems: 'center', justifyContent: 'center' },
    splashLogoWrap: { alignItems: 'center', marginBottom: 20 },
    splashLogo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF15', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 20, borderWidth: 2, borderColor: accentColor },
    splashLogoText: { fontSize: 52, fontWeight: '900', color: '#FFFFFF', letterSpacing: 4 },
    splashAmpersand: { fontSize: 52, fontWeight: '900', color: accentColor, marginHorizontal: 8 },
    splashGavelIcon: { marginTop: 16 },
    splashTagline: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 6, marginBottom: 8 },
    splashSubtag: { fontSize: 13, color: '#FFFFFFAA', letterSpacing: 1 },
    splashDots: { flexDirection: 'row', marginTop: 48 },
    splashDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
    welcomeContainer: { flex: 1, backgroundColor: primaryColor },
    welcomeTop: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    welcomeLogoSmall: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFFFFF15', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 2, borderColor: accentColor },
    welcomeLogoTxt: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
    welcomeTitle: { fontSize: 30, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 12 },
    welcomeSubtitle: { fontSize: 15, color: '#FFFFFFAA', textAlign: 'center', lineHeight: 22 },
    welcomeActions: { backgroundColor: cardColor, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: 8 },
    welcomeDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 16 },
    welcomeTerms: { color: textSecondary, fontSize: 11, textAlign: 'center', lineHeight: 16 },
    authHeader: { backgroundColor: primaryColor, flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 16 },
    authHeaderTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginLeft: 8 },
    authLogo: { width: 60, height: 60, borderRadius: 30, backgroundColor: primaryColor, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16, marginTop: 8 },
    authLogoText: { color: '#FFF', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
    authTitle: { fontSize: 24, fontWeight: '800', color: textPrimary, marginBottom: 6 },
    authSubtitle: { fontSize: 14, color: textSecondary, marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 13, fontWeight: '600', color: textPrimary, marginBottom: 6 },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0' },
    textInput: { flex: 1, marginLeft: 10, fontSize: 14, color: textPrimary, paddingVertical: 2 },
    countryCode: { backgroundColor: '#F1F5F9', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8 },
    otpBox: { width: 44, height: 52, borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 10, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: primaryColor, marginHorizontal: 4, backgroundColor: cardColor },
    stepIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    stepNum: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
    stepLine: { flex: 1, height: 2, backgroundColor: '#E2E8F0' },
    roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 14, padding: 18, borderWidth: 2, borderColor: '#E2E8F0' },
    roleCardActive: { borderColor: primaryColor, backgroundColor: '#EFF6FF' },
    roleIcon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    roleTitle: { fontSize: 18, fontWeight: '700', color: textPrimary, marginBottom: 4 },
    roleDesc: { fontSize: 13, color: textSecondary, lineHeight: 18 },
    ratingPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', padding: 12, borderRadius: 10, marginTop: 8 },
    celebrationWrap: { alignItems: 'center', marginVertical: 24 },
    celebTitle: { fontSize: 26, fontWeight: '900', color: textPrimary, marginTop: 12 },
    celebSubtitle: { fontSize: 15, color: textSecondary, marginTop: 6 },
    ratingCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: cardColor, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: primaryColor, elevation: 8, shadowColor: primaryColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, marginVertical: 16 },
    ratingBig: { fontSize: 48, fontWeight: '900', color: primaryColor },
    ratingOutOf: { fontSize: 18, color: textSecondary, fontWeight: '600' },
    ratingLabel: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
    ratingLabelText: { fontWeight: '700', fontSize: 13 },
    badgeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: primaryColor + '30' },
    badgeIdText: { color: primaryColor, fontWeight: '800', fontSize: 18, marginLeft: 12 },
    btnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: primaryColor, borderRadius: 12, paddingVertical: 15, paddingHorizontal: 24, gap: 8 },
    btnPrimaryText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    btnOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: cardColor, borderRadius: 12, paddingVertical: 15, paddingHorizontal: 24, borderWidth: 2, borderColor: primaryColor, marginTop: 12, gap: 8 },
    btnOutlineText: { color: primaryColor, fontWeight: '700', fontSize: 16 },
    homeHeader: { backgroundColor: primaryColor, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    homeGreeting: { color: '#FFFFFFAA', fontSize: 13 },
    homeUserName: { color: '#FFF', fontSize: 20, fontWeight: '800' },
    homeHeaderTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', flex: 1 },
    homeLnrBadge: { backgroundColor: accentColor + '30', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: accentColor },
    homeLnrText: { color: accentColor, fontWeight: 'bold', fontSize: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: textPrimary },
    postCard: { backgroundColor: cardColor, marginHorizontal: 16, marginBottom: 16, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#E8EEF8', elevation: 2 },
    postHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
    postAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: primaryColor, alignItems: 'center', justifyContent: 'center' },
    postAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    postAdvName: { fontWeight: '700', color: textPrimary, fontSize: 15 },
    postTitle: { fontWeight: '700', color: textPrimary, fontSize: 15, paddingHorizontal: 14, paddingBottom: 6 },
    postDesc: { color: textSecondary, fontSize: 13, paddingHorizontal: 14, paddingBottom: 12, lineHeight: 20 },
    postImage: { width: '100%', height: 200, backgroundColor: '#E2E8F0' },
    postActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    postAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 },
    postActionTxt: { color: textSecondary, fontSize: 13 },
    caseTypeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
    caseTypeTxt: { fontSize: 11, fontWeight: '600' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#E2E8F0' },
    searchBarLarge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 2, borderColor: primaryColor + '40' },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: textPrimary, paddingVertical: 8 },
    searchBtn: { backgroundColor: primaryColor, padding: 10, borderRadius: 8 },
    filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8, borderWidth: 1, borderColor: '#E2E8F0' },
    filterChipActive: { backgroundColor: primaryColor, borderColor: primaryColor },
    filterChipTxt: { fontSize: 12, fontWeight: '600', color: textSecondary },
    filterChipTxtActive: { color: '#FFF' },
    caseCard: { backgroundColor: cardColor, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E8EEF8', elevation: 1 },
    caseCardTop: { flexDirection: 'row', marginBottom: 10 },
    caseTypePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    caseStatusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginLeft: 8 },
    caseClientName: { fontSize: 16, fontWeight: '700', color: textPrimary, marginBottom: 6 },
    caseDesc: { fontSize: 13, color: textSecondary, lineHeight: 20, marginBottom: 8 },
    caseCardBottom: { flexDirection: 'row', alignItems: 'center' },
    caseLocation: { fontSize: 12, color: textSecondary, marginLeft: 3 },
    caseDetailHeader: { flexDirection: 'row', marginBottom: 12 },
    caseDetailTitle: { fontSize: 20, fontWeight: '800', color: textPrimary, marginBottom: 12 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoRowText: { color: textSecondary, fontSize: 14, marginLeft: 6 },
    detailSection: { marginBottom: 20 },
    detailSectionTitle: { fontSize: 14, fontWeight: '700', color: primaryColor, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    detailSectionBody: { fontSize: 15, color: textPrimary, lineHeight: 24 },
    contactInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
    contactAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: primaryColor, alignItems: 'center', justifyContent: 'center' },
    contactAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
    noticeBox: { flexDirection: 'row', backgroundColor: '#FFFBEB', padding: 12, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#D97706', marginBottom: 16 },
    noticeText: { color: '#92400E', fontSize: 12, flex: 1, marginLeft: 8, lineHeight: 18 },
    caseDetailActions: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, backgroundColor: cardColor, borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 12 },
    callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: primaryColor, borderRadius: 12, paddingVertical: 14, gap: 8 },
    callBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
    msgBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', borderRadius: 12, paddingVertical: 14, gap: 8 },
    profileBanner: { backgroundColor: primaryColor, paddingHorizontal: 20, paddingBottom: 20 },
    profileBannerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
    profileCard: { backgroundColor: cardColor, margin: 16, borderRadius: 16, padding: 20, alignItems: 'center', elevation: 3 },
    profileAvatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: primaryColor, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    profileAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 32 },
    profileName: { fontSize: 22, fontWeight: '800', color: textPrimary, marginBottom: 4 },
    profileLnrRow: { flexDirection: 'row', alignItems: 'center' },
    profileLnrId: { color: textSecondary, fontSize: 14, marginLeft: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    ratingVal: { color: accentColor, fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
    profileInfoBlock: { backgroundColor: cardColor, marginHorizontal: 16, marginBottom: 12, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E8EEF8' },
    profileBlockTitle: { fontSize: 14, fontWeight: '700', color: primaryColor, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
    profileInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    profileInfoTxt: { color: textPrimary, fontSize: 14, marginLeft: 10, flex: 1 },
    advCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: cardColor, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E8EEF8', elevation: 1 },
    advAvatarLg: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
    advAvatarLgText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
    advName: { fontSize: 16, fontWeight: '700', color: textPrimary },
    advSpec: { fontSize: 13, color: textSecondary, marginTop: 2 },
    mediaButtons: { flexDirection: 'row', gap: 12, marginVertical: 12 },
    mediaBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF', borderRadius: 10, paddingVertical: 12, borderWidth: 1, borderColor: primaryColor + '30', gap: 6 },
    mediaBtnText: { color: primaryColor, fontWeight: '600', fontSize: 13 },
    audioPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 10, borderRadius: 8, marginTop: 4 },
    dropdown: { backgroundColor: cardColor, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 4, elevation: 4, zIndex: 100 },
    dropdownItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    dropdownText: { fontSize: 14, color: textPrimary },
    emptyState: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
    emptyText: { color: textSecondary, fontSize: 16, marginTop: 12, textAlign: 'center' },
    casesCount: { backgroundColor: successColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    advDetailBanner: { backgroundColor: primaryColor, paddingBottom: 24 },
    advDetailBannerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 12 },
    advDetailProfile: { alignItems: 'center', paddingBottom: 8 },
    advDetailAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: accentColor, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 3, borderColor: '#FFFFFF50' },
    advDetailAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 32 },
    advDetailName: { color: '#FFF', fontSize: 22, fontWeight: '800' },
    statsRow: { flexDirection: 'row', backgroundColor: cardColor, marginHorizontal: 16, marginTop: 16, borderRadius: 14, padding: 16, elevation: 2, borderWidth: 1, borderColor: '#E8EEF8' },
    statItem: { flex: 1, alignItems: 'center' },
    statNum: { fontSize: 22, fontWeight: '800', color: primaryColor },
    statLbl: { fontSize: 12, color: textSecondary, marginTop: 2 },
    statDivider: { width: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },
    myCaseItem: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
    lnrIdBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: primaryColor + '30' },
    statChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, margin: 4 },
    statChipText: { color: primaryColor, fontSize: 13, fontWeight: '600', marginLeft: 4 },
  });

  // ── Root Navigator ────────────────────────────────────────────
  return React.createElement(AppProvider, null,
    React.createElement(ThemeProvider, null,
      React.createElement(View, { style: { flex: 1, width: '100%', height: '100%' } },
        React.createElement(StatusBar, { barStyle: 'light-content', backgroundColor: primaryColor }),
        React.createElement(RootStack.Navigator, { screenOptions: { headerShown: false }, initialRouteName: 'Splash' },
          React.createElement(RootStack.Screen, { name: 'Splash',             component: SplashScreen }),
          React.createElement(RootStack.Screen, { name: 'Welcome',            component: WelcomeScreen }),
          React.createElement(RootStack.Screen, { name: 'Login',              component: LoginScreen }),
          React.createElement(RootStack.Screen, { name: 'OTPVerify',          component: OTPScreen,                  initialParams: { mobile: '', fromLogin: false, regData: null } }),
          React.createElement(RootStack.Screen, { name: 'SignInBasic',        component: SignInBasicScreen }),
          React.createElement(RootStack.Screen, { name: 'UserType',           component: UserTypeScreen,             initialParams: { regData: {}, userId: null } }),
          React.createElement(RootStack.Screen, { name: 'AdvocateDetails',    component: AdvocateDetailsScreen,      initialParams: { regData: {}, userId: null } }),
          React.createElement(RootStack.Screen, { name: 'AdvocateRating',     component: AdvocateRatingScreen,       initialParams: { profile: {}, rating: '7.5' } }),
          React.createElement(RootStack.Screen, { name: 'AdvocateApp',        component: AdvocateTabNavigator }),
          React.createElement(RootStack.Screen, { name: 'ClientApp',          component: ClientTabNavigator }),
          React.createElement(RootStack.Screen, { name: 'AdvocateProfileDetail', component: AdvocateProfileDetailScreen, initialParams: { advocate: null } }),
          React.createElement(RootStack.Screen, { name: 'CaseDetail',         component: CaseDetailScreen,           initialParams: { caseData: null } })
        )
      )
    )
  );
};
return ComponentFunction;